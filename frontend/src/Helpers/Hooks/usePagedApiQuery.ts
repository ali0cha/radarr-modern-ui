import { keepPreviousData } from '@tanstack/react-query';
import { PropertyFilter } from 'App/State/AppState';
import { SortDirection } from 'Helpers/Props/sortDirections';
import useApiQuery from './useApiQuery';

export interface PagedResponse<T> {
  page: number;
  pageSize: number;
  sortKey: string;
  sortDirection: SortDirection;
  totalRecords: number;
  records: T[];
}

interface PagedQueryOptions {
  path: string;
  page: number;
  pageSize: number;
  sortKey?: string;
  sortDirection?: SortDirection;
  // The server filters by query parameters named after the key of the filter,
  // lists are sent as repeated parameters.
  filters?: PropertyFilter[];
}

const NO_RECORDS: never[] = [];

// A collection that the server cuts in pages. The page that was shown stays
// until the next one is loaded.
function usePagedApiQuery<T>({
  path,
  page,
  pageSize,
  sortKey,
  sortDirection,
  filters = [],
}: PagedQueryOptions) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (sortKey) {
    params.set('sortKey', sortKey);
  }

  if (sortDirection) {
    params.set('sortDirection', sortDirection);
  }

  filters.forEach(({ key, value }) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)));
    } else {
      params.set(key, String(value));
    }
  });

  const { data, isFetching, isSuccess, error, refetch } = useApiQuery<
    PagedResponse<T>
  >({
    path: `${path}?${params.toString()}`,
    queryOptions: {
      retry: false,
      placeholderData: keepPreviousData,
    },
  });

  const totalRecords = data?.totalRecords ?? 0;

  return {
    items: data?.records ?? (NO_RECORDS as T[]),
    totalRecords,
    totalPages: Math.max(Math.ceil(totalRecords / pageSize), 1),
    isFetching,
    isPopulated: isSuccess,
    error,
    refetch,
  };
}

export default usePagedApiQuery;
