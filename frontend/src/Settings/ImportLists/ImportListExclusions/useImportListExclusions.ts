import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { createPersist } from 'Helpers/createPersist';
import { invalidateApiQueries } from 'Helpers/Hooks/useApiQuery';
import usePagedApiQuery from 'Helpers/Hooks/usePagedApiQuery';
import {
  ASCENDING,
  DESCENDING,
  SortDirection,
} from 'Helpers/Props/sortDirections';
import ImportListExclusion from 'typings/ImportListExclusion';

export const IMPORT_LIST_EXCLUSIONS_PATH = '/exclusions';

export const NEW_IMPORT_LIST_EXCLUSION = {
  movieTitle: '',
  movieYear: 0,
  tmdbId: 0,
} as ImportListExclusion;

interface OptionsState {
  pageSize: number;
}

// The size of the pages is remembered, as it was in the Redux state.
const optionsStore = createPersist<OptionsState>(
  'import_list_exclusions_options',
  () => ({ pageSize: 20 }),
  {
    migrateFromLegacy: (legacyState) => {
      const settings = legacyState.settings as
        | { importListExclusions?: { pageSize?: unknown } }
        | undefined;
      const pageSize = settings?.importListExclusions?.pageSize;

      return typeof pageSize === 'number' ? { pageSize } : undefined;
    },
  }
);

export const useImportListExclusionsPageSize = () => {
  return optionsStore((state) => state.pageSize);
};

export const setImportListExclusionsPageSize = (pageSize: number) => {
  optionsStore.setState({ pageSize });
};

// Whatever changes the exclusions makes the pages that were fetched stale
export function useInvalidateImportListExclusions() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    invalidateApiQueries(queryClient, IMPORT_LIST_EXCLUSIONS_PATH);
  }, [queryClient]);
}

export function useImportListExclusions(page: number) {
  const pageSize = useImportListExclusionsPageSize();

  const [sort, setSort] = useState<{
    sortKey?: string;
    sortDirection?: SortDirection;
  }>({});

  const handleSortPress = useCallback(
    (sortKey: string, sortDirection?: SortDirection) => {
      setSort((current) => {
        if (sortDirection) {
          return { sortKey, sortDirection };
        }

        // The same column again reverses the order
        if (current.sortKey === sortKey) {
          return {
            sortKey,
            sortDirection:
              current.sortDirection === ASCENDING ? DESCENDING : ASCENDING,
          };
        }

        return { sortKey, sortDirection: current.sortDirection };
      });
    },
    []
  );

  const result = usePagedApiQuery<ImportListExclusion>({
    path: `${IMPORT_LIST_EXCLUSIONS_PATH}/paged`,
    page,
    pageSize,
    sortKey: sort.sortKey,
    sortDirection: sort.sortDirection,
  });

  return { ...result, pageSize, ...sort, handleSortPress };
}
