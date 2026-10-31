import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import { createPagedTable } from 'Components/Table/pagedTable';
import usePagedTable from 'Components/Table/usePagedTable';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import { invalidateApiQueries } from 'Helpers/Hooks/useApiQuery';
import {
  filterBuilderTypes,
  filterBuilderValueTypes,
  filterTypes,
  icons,
} from 'Helpers/Props';
import History from 'typings/History';
import translate from 'Utilities/String/translate';

export const HISTORY_PATH = '/history';

function eventTypeFilter(key: string, label: string, eventType: string) {
  return {
    key,
    label: () => translate(label),
    filters: [{ key: 'eventType', value: eventType, type: filterTypes.EQUAL }],
  };
}

export const historyTable = createPagedTable('history', {
  pageSize: 20,
  sortKey: 'date',
  sortDirection: 'descending',
  selectedFilterKey: 'all',

  columns: [
    {
      name: 'eventType',
      columnLabel: () => translate('EventType'),
      label: '',
      isVisible: true,
      isModifiable: false,
    },
    {
      name: 'movieMetadata.sortTitle',
      label: () => translate('Movie'),
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
      name: 'date',
      label: () => translate('Date'),
      isSortable: true,
      isVisible: true,
    },
    {
      name: 'downloadClient',
      label: () => translate('DownloadClient'),
      isVisible: false,
    },
    {
      name: 'indexer',
      label: () => translate('Indexer'),
      isVisible: false,
    },
    {
      name: 'releaseGroup',
      label: () => translate('ReleaseGroup'),
      isVisible: false,
    },
    {
      name: 'sourceTitle',
      label: () => translate('SourceTitle'),
      isVisible: false,
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
      name: 'details',
      columnLabel: () => translate('Details'),
      label: '',
      isVisible: true,
      isModifiable: false,
    },
  ],

  filters: [
    {
      key: 'all',
      label: () => translate('All'),
      filters: [],
    },
    eventTypeFilter('grabbed', 'Grabbed', '1'),
    eventTypeFilter('imported', 'Imported', '3'),
    eventTypeFilter('failed', 'Failed', '4'),
    eventTypeFilter('deleted', 'Deleted', '6'),
    eventTypeFilter('renamed', 'Renamed', '8'),
    eventTypeFilter('ignored', 'Ignored', '9'),
  ],

  filterBuilderProps: [
    {
      name: 'eventType',
      label: () => translate('EventType'),
      type: filterBuilderTypes.EQUAL,
      valueType: filterBuilderValueTypes.HISTORY_EVENT_TYPE,
    },
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
  ],
});

export function useHistory() {
  return usePagedTable<History>({
    table: historyTable,
    path: HISTORY_PATH,
    customFilterType: 'history',
  });
}

export function useMarkHistoryAsFailed(
  id: number,
  onMarkedAsFailed: () => void
) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useApiMutation<unknown>({
    path: `${HISTORY_PATH}/failed/${id}`,
    method: 'POST',
    sendBody: false,
    mutationOptions: {
      onSuccess: () => {
        invalidateApiQueries(queryClient, HISTORY_PATH);
        onMarkedAsFailed();
      },
    },
  });

  const markAsFailed = useCallback(() => mutate(), [mutate]);

  return { markAsFailed, isMarkingAsFailed: isPending };
}
