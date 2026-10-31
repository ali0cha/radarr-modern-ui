import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import AppState, { CustomFilter } from 'App/State/AppState';
import usePagedApiQuery from 'Helpers/Hooks/usePagedApiQuery';
import { SortDirection } from 'Helpers/Props/sortDirections';
import { TableOptionsChangePayload } from 'typings/Table';
import findSelectedFilters from 'Utilities/Filter/findSelectedFilters';
import {
  registerPagePopulator,
  unregisterPagePopulator,
} from 'Utilities/pagePopulator';
import { mergeColumns, PagedTable } from './pagedTable';
import { usePagerHandlers } from './usePageNavigation';

interface PagedTableOptions {
  table: PagedTable;
  path: string;
  // The type under which the custom filters of this table are saved
  customFilterType: string;
}

// A table that the server cuts in pages, sorts and filters: what is shown comes
// from the query, the preferences from the store of the table.
function usePagedTable<T>({
  table,
  path,
  customFilterType,
}: PagedTableOptions) {
  const {
    pageSize,
    sortKey,
    sortDirection,
    selectedFilterKey,
    columns: storedColumns,
    setSort,
    setSelectedFilterKey,
    setOptions,
  } = table.useStore();

  const [page, setPage] = useState(1);

  const allCustomFilters = useSelector(
    (state: AppState) => state.customFilters.items
  ) as CustomFilter[];

  const customFilters = useMemo(
    () => allCustomFilters.filter(({ type }) => type === customFilterType),
    [allCustomFilters, customFilterType]
  );

  const filters = useMemo(
    () =>
      findSelectedFilters(selectedFilterKey, table.filters, customFilters) as {
        key: string;
        value: string | number | boolean | string[] | number[];
        type: string;
      }[],
    [selectedFilterKey, table.filters, customFilters]
  );

  const columns = useMemo(
    () => mergeColumns(table.columns, storedColumns),
    [table.columns, storedColumns]
  );

  const query = usePagedApiQuery<T>({
    path,
    page,
    pageSize,
    sortKey,
    sortDirection,
    filters,
  });

  const { totalPages, refetch } = query;

  const pagerHandlers = usePagerHandlers({ page, totalPages, setPage });

  // Pressing refresh shows the first page again, even when it is shown already
  const handleRefreshPress = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const handleSortPress = useCallback(
    (key: string, direction?: SortDirection) => {
      if (direction) {
        setSort(key, direction);
      } else if (key === sortKey) {
        setSort(
          key,
          sortDirection === 'ascending' ? 'descending' : 'ascending'
        );
      } else {
        setSort(key, sortDirection);
      }
    },
    [sortKey, sortDirection, setSort]
  );

  const handleFilterSelect = useCallback(
    (key: string | number) => {
      setSelectedFilterKey(key);
      setPage(1);
    },
    [setSelectedFilterKey]
  );

  const handleTableOptionChange = useCallback(
    (payload: TableOptionsChangePayload) => {
      setOptions({ pageSize: payload.pageSize, columns: payload.columns });

      if (payload.pageSize) {
        setPage(1);
      }
    },
    [setOptions]
  );

  // The page is shown again when the connection to the server is back
  useEffect(() => {
    const repopulate = () => {
      refetch();
    };

    registerPagePopulator(repopulate);

    return () => {
      unregisterPagePopulator(repopulate);
    };
  }, [refetch]);

  return {
    ...query,
    ...pagerHandlers,
    page,
    setPage,
    pageSize,
    sortKey,
    sortDirection,
    selectedFilterKey,
    columns,
    filters: table.filters,
    customFilters,
    handleRefreshPress,
    handleSortPress,
    handleFilterSelect,
    handleTableOptionChange,
  };
}

export default usePagedTable;
