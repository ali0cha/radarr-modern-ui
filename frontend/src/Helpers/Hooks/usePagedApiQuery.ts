import { keepPreviousData } from '@tanstack/react-query';
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

  const { data, isFetching, isSuccess, error } = useApiQuery<PagedResponse<T>>({
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
  };
}

export default usePagedApiQuery;
