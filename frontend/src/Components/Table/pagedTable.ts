import { Filter, FilterBuilderProp } from 'App/State/AppState';
import Column from 'Components/Table/Column';
import { createPersist } from 'Helpers/createPersist';
import { SortDirection } from 'Helpers/Props/sortDirections';

type FilterKey = string | number;

interface StoredColumn {
  name: string;
  isVisible: boolean;
}

// What is remembered of a table that the server cuts in pages
interface PagedTableState {
  pageSize: number;
  sortKey: string;
  sortDirection: SortDirection;
  selectedFilterKey: FilterKey;
  columns: StoredColumn[];
}

interface PagedTableActions {
  setSort: (sortKey: string, sortDirection: SortDirection) => void;
  setSelectedFilterKey: (selectedFilterKey: FilterKey) => void;
  setOptions: (options: { pageSize?: number; columns?: Column[] }) => void;
}

export interface PagedTableDefinition {
  columns: Column[];
  filters: Filter[];
  filterBuilderProps: FilterBuilderProp<unknown>[];
  pageSize: number;
  sortKey: string;
  sortDirection: SortDirection;
  selectedFilterKey: FilterKey;
}

export interface PagedTable extends PagedTableDefinition {
  useStore: ReturnType<
    typeof createPersist<PagedTableState & PagedTableActions>
  >;
}

const toStoredColumns = (columns: Column[]): StoredColumn[] =>
  columns.map(({ name, isVisible }) => ({ name, isVisible }));

// The columns of the definition, in the order and with the visibility that
// were saved. The columns that were added since go where they were defined.
export function mergeColumns(
  definedColumns: Column[],
  storedColumns: StoredColumn[]
) {
  if (!storedColumns.length) {
    return definedColumns;
  }

  const columns: Column[] = [];

  storedColumns.forEach((stored) => {
    const column = definedColumns.find(({ name }) => name === stored.name);

    if (column) {
      columns.push({ ...column, isVisible: stored.isVisible });
    }
  });

  definedColumns.forEach((column, index) => {
    if (!storedColumns.some(({ name }) => name === column.name)) {
      columns.splice(index, 0, column);
    }
  });

  return columns;
}

// The preferences of a table (columns, page size, sort and filter) are saved
// like they were in the Redux section of the same name.
export function createPagedTable(
  section: string,
  definition: PagedTableDefinition
): PagedTable {
  const useStore = createPersist<PagedTableState & PagedTableActions>(
    `${section}_table`,
    (set) => ({
      pageSize: definition.pageSize,
      sortKey: definition.sortKey,
      sortDirection: definition.sortDirection,
      selectedFilterKey: definition.selectedFilterKey,
      columns: toStoredColumns(definition.columns),

      setSort: (sortKey, sortDirection) => set({ sortKey, sortDirection }),
      setSelectedFilterKey: (selectedFilterKey) => set({ selectedFilterKey }),
      setOptions: ({ pageSize, columns }) =>
        set({
          ...(pageSize ? { pageSize } : {}),
          ...(columns ? { columns: toStoredColumns(columns) } : {}),
        }),
    }),
    {
      partialize: ({
        pageSize,
        sortKey,
        sortDirection,
        selectedFilterKey,
        columns,
      }) =>
        ({
          pageSize,
          sortKey,
          sortDirection,
          selectedFilterKey,
          columns,
        } as PagedTableState & PagedTableActions),
      migrateFromLegacy: (legacyState) => {
        const legacy = legacyState[section] as
          | Partial<PagedTableState>
          | undefined;

        if (!legacy) {
          return undefined;
        }

        const { pageSize, sortKey, sortDirection, selectedFilterKey, columns } =
          legacy;

        return {
          ...(pageSize ? { pageSize } : {}),
          ...(sortKey ? { sortKey } : {}),
          ...(sortDirection ? { sortDirection } : {}),
          ...(selectedFilterKey ? { selectedFilterKey } : {}),
          ...(columns ? { columns: toStoredColumns(columns as Column[]) } : {}),
        } as Partial<PagedTableState & PagedTableActions>;
      },
    }
  );

  return { ...definition, useStore };
}
