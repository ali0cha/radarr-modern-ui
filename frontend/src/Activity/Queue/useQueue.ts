import { QueryClient, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useMemo } from 'react';
import Icon from 'Components/Icon';
import { createPagedTable } from 'Components/Table/pagedTable';
import usePagedTable from 'Components/Table/usePagedTable';
import { createPersist } from 'Helpers/createPersist';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery, {
  getApiQueryKey,
  invalidateApiQueries,
} from 'Helpers/Hooks/useApiQuery';
import {
  filterBuilderTypes,
  filterBuilderValueTypes,
  icons,
} from 'Helpers/Props';
import Queue from 'typings/Queue';
import translate from 'Utilities/String/translate';

export const QUEUE_PATH = '/queue';
export const QUEUE_DETAILS_PATH = '/queue/details';
export const QUEUE_STATUS_PATH = '/queue/status';

// The pages of the queue have a query string, which the status and the details
// do not.
const QUEUE_PAGES_PATH = `${QUEUE_PATH}?`;

interface QueueOptionsState {
  includeUnknownMovieItems: boolean;
}

const queueOptionsStore = createPersist<QueueOptionsState>(
  'queue_options',
  () => ({ includeUnknownMovieItems: true }),
  {
    migrateFromLegacy: (legacyState) => {
      const options = (
        legacyState.queue as
          | { options?: Partial<QueueOptionsState> }
          | undefined
      )?.options;

      return typeof options?.includeUnknownMovieItems === 'boolean'
        ? { includeUnknownMovieItems: options.includeUnknownMovieItems }
        : undefined;
    },
  }
);

export const useIncludeUnknownMovieItems = () =>
  queueOptionsStore((state) => state.includeUnknownMovieItems);

export const setIncludeUnknownMovieItems = (
  includeUnknownMovieItems: boolean
) => queueOptionsStore.setState({ includeUnknownMovieItems });

export const queueTable = createPagedTable('queue.paged', {
  pageSize: 20,
  sortKey: 'timeleft',
  sortDirection: 'ascending',
  selectedFilterKey: 'all',

  columns: [
    {
      name: 'status',
      columnLabel: () => translate('Status'),
      label: '',
      isSortable: true,
      isVisible: true,
      isModifiable: false,
    },
    {
      name: 'movies.sortTitle',
      label: () => translate('Movie'),
      isSortable: true,
      isVisible: true,
    },
    {
      name: 'year',
      label: () => translate('Year'),
      isSortable: true,
      isVisible: true,
    },
    {
      name: 'languages',
      label: () => translate('Languages'),
      isSortable: true,
      isVisible: true,
    },
    {
      name: 'quality',
      label: () => translate('Quality'),
      isSortable: true,
      isVisible: true,
    },
    {
      name: 'customFormats',
      label: () => translate('Formats'),
      isSortable: false,
      isVisible: true,
    },
    {
      name: 'customFormatScore',
      columnLabel: () => translate('CustomFormatScore'),
      label: React.createElement(Icon, {
        name: icons.SCORE,
        title: () => translate('CustomFormatScore'),
      }),
      isVisible: false,
    },
    {
      name: 'protocol',
      label: () => translate('Protocol'),
      isSortable: true,
      isVisible: false,
    },
    {
      name: 'indexer',
      label: () => translate('Indexer'),
      isSortable: true,
      isVisible: false,
    },
    {
      name: 'downloadClient',
      label: () => translate('DownloadClient'),
      isSortable: true,
      isVisible: false,
    },
    {
      name: 'size',
      label: () => translate('Size'),
      isSortable: true,
      isVisible: false,
    },
    {
      name: 'title',
      label: () => translate('ReleaseTitle'),
      isSortable: true,
      isVisible: false,
    },
    {
      name: 'outputPath',
      label: () => translate('OutputPath'),
      isSortable: false,
      isVisible: false,
    },
    {
      name: 'estimatedCompletionTime',
      label: () => translate('Timeleft'),
      isSortable: true,
      isVisible: true,
    },
    {
      name: 'added',
      label: () => translate('Added'),
      isSortable: true,
      isVisible: false,
    },
    {
      name: 'progress',
      label: () => translate('Progress'),
      isSortable: true,
      isVisible: true,
    },
    {
      name: 'actions',
      columnLabel: () => translate('Actions'),
      label: '',
      isVisible: true,
      isModifiable: false,
    },
  ],

  filters: [
    {
      key: 'all',
      label: 'All',
      filters: [],
    },
  ],

  filterBuilderProps: [
    {
      name: 'movieIds',
      label: () => translate('Movie'),
      type: filterBuilderTypes.EQUAL,
      valueType: filterBuilderValueTypes.MOVIE,
    },
    {
      name: 'quality',
      label: () => translate('Quality'),
      type: filterBuilderTypes.EQUAL,
      valueType: filterBuilderValueTypes.QUALITY,
    },
    {
      name: 'languages',
      label: () => translate('Languages'),
      type: filterBuilderTypes.CONTAINS,
      valueType: filterBuilderValueTypes.LANGUAGE,
    },
    {
      name: 'protocol',
      label: () => translate('Protocol'),
      type: filterBuilderTypes.EQUAL,
      valueType: filterBuilderValueTypes.PROTOCOL,
    },
    {
      name: 'status',
      label: () => translate('Status'),
      type: filterBuilderTypes.EQUAL,
      valueType: filterBuilderValueTypes.QUEUE_STATUS,
    },
  ],
});

export function useQueue() {
  const includeUnknownMovieItems = useIncludeUnknownMovieItems();

  const params = useMemo(
    () => ({ includeUnknownMovieItems }),
    [includeUnknownMovieItems]
  );

  return usePagedTable<Queue>({
    table: queueTable,
    path: QUEUE_PATH,
    customFilterType: 'queue',
    params,
  });
}

// SignalR says that the queue changed: the page that is shown is fetched again
export function invalidateQueuePages(queryClient: QueryClient) {
  return invalidateApiQueries(queryClient, QUEUE_PAGES_PATH);
}

// SignalR says that the queue details changed
export function invalidateQueueDetails(queryClient: QueryClient) {
  return invalidateApiQueries(queryClient, QUEUE_DETAILS_PATH);
}

// SignalR sends the new status itself
export function setQueueStatus(queryClient: QueryClient, status: QueueStatus) {
  queryClient.setQueriesData(
    { queryKey: getApiQueryKey(QUEUE_STATUS_PATH) },
    status
  );
}

// The connection is back, what was received meanwhile is lost
export function invalidateQueue(queryClient: QueryClient) {
  return invalidateApiQueries(queryClient, QUEUE_PATH);
}

// What every screen that shows the state of a movie needs: the whole queue,
// shared by all of them. SignalR tells when to fetch it again.
const queueDetailsQueryOptions = {
  retry: false,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
};

const NO_QUEUE_ITEMS: Queue[] = [];

export function useQueueDetails() {
  const { data } = useApiQuery<Queue[]>({
    path: QUEUE_DETAILS_PATH,
    queryOptions: queueDetailsQueryOptions,
  });

  return data ?? NO_QUEUE_ITEMS;
}

export function useQueueItemForMovie(movieId: number | undefined) {
  const items = useQueueDetails();

  return useMemo(() => {
    if (!movieId) {
      return null;
    }

    return items.find((item) => item.movieId === movieId) ?? null;
  }, [items, movieId]);
}

// The number of downloads of a movie that are not imported yet
export function useMovieQueueCount(movieId: number) {
  const items = useQueueDetails();

  return useMemo(
    () =>
      items.filter(
        (item) =>
          item.movieId === movieId && item.trackedDownloadState !== 'imported'
      ).length,
    [items, movieId]
  );
}

export interface QueueStatus {
  errors: boolean;
  warnings: boolean;
  unknownErrors: boolean;
  unknownWarnings: boolean;
  count: number;
  totalCount: number;
}

export function useQueueStatus() {
  const includeUnknownMovieItems = useIncludeUnknownMovieItems();

  const { data, isSuccess, refetch } = useApiQuery<QueueStatus>({
    path: QUEUE_STATUS_PATH,
    queryOptions: queueDetailsQueryOptions,
  });

  if (!data) {
    return {
      isPopulated: isSuccess,
      count: 0,
      errors: false,
      warnings: false,
      refetch,
    };
  }

  // The items without a movie are counted when they are shown
  return {
    isPopulated: isSuccess,
    count: includeUnknownMovieItems ? data.totalCount : data.count,
    errors: includeUnknownMovieItems
      ? data.errors || data.unknownErrors
      : data.errors,
    warnings: includeUnknownMovieItems
      ? data.warnings || data.unknownWarnings
      : data.warnings,
    refetch,
  };
}

function useInvalidateQueuePages() {
  const queryClient = useQueryClient();

  return useCallback(() => invalidateQueuePages(queryClient), [queryClient]);
}

export function useGrabQueueItem(id: number) {
  const invalidatePages = useInvalidateQueuePages();

  const { mutate, isPending, error } = useApiMutation<unknown>({
    path: `${QUEUE_PATH}/grab/${id}`,
    method: 'POST',
    sendBody: false,
    mutationOptions: { onSuccess: invalidatePages },
  });

  return { grab: () => mutate(), isGrabbing: isPending, grabError: error };
}

export function useGrabQueueItems(onGrabbed?: () => void) {
  const invalidatePages = useInvalidateQueuePages();

  const { mutate, isPending } = useApiMutation<unknown, { ids: number[] }>({
    path: `${QUEUE_PATH}/grab/bulk`,
    method: 'POST',
    mutationOptions: {
      onSuccess: () => {
        invalidatePages();
        onGrabbed?.();
      },
    },
  });

  return { grabItems: mutate, isGrabbing: isPending };
}

export interface RemoveQueueItemOptions {
  remove: boolean;
  blocklist: boolean;
  skipRedownload: boolean;
  changeCategory: boolean;
}

function getRemoveQuery({
  remove,
  blocklist,
  skipRedownload,
  changeCategory,
}: RemoveQueueItemOptions) {
  return `removeFromClient=${remove}&blocklist=${blocklist}&skipRedownload=${skipRedownload}&changeCategory=${changeCategory}`;
}

export function useRemoveQueueItem(id: number) {
  const invalidatePages = useInvalidateQueuePages();

  const { mutate, isPending } = useApiMutation<unknown, RemoveQueueItemOptions>(
    {
      path: (options) => `${QUEUE_PATH}/${id}?${getRemoveQuery(options)}`,
      method: 'DELETE',
      mutationOptions: { onSuccess: invalidatePages },
    }
  );

  return { removeItem: mutate, isRemoving: isPending };
}

export function useRemoveQueueItems(onRemoved?: () => void) {
  const invalidatePages = useInvalidateQueuePages();

  const { mutate, isPending } = useApiMutation<
    unknown,
    RemoveQueueItemOptions & { ids: number[] }
  >({
    path: (options) => `${QUEUE_PATH}/bulk?${getRemoveQuery(options)}`,
    method: 'DELETE',
    sendBody: true,
    mutationOptions: {
      onSuccess: () => {
        invalidatePages();
        onRemoved?.();
      },
    },
  });

  return { removeItems: mutate, isRemoving: isPending };
}
