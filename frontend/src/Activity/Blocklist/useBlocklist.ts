import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { createPagedTable } from 'Components/Table/pagedTable';
import usePagedTable from 'Components/Table/usePagedTable';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import { invalidateApiQueries } from 'Helpers/Hooks/useApiQuery';
import { filterBuilderTypes, filterBuilderValueTypes } from 'Helpers/Props';
import Blocklist from 'typings/Blocklist';
import translate from 'Utilities/String/translate';

export const BLOCKLIST_PATH = '/blocklist';

export const blocklistTable = createPagedTable('blocklist', {
  pageSize: 20,
  sortKey: 'date',
  sortDirection: 'descending',
  selectedFilterKey: 'all',

  columns: [
    {
      name: 'movieMetadata.sortTitle',
      label: () => translate('MovieTitle'),
      isSortable: true,
      isVisible: true,
    },
    {
      name: 'sourceTitle',
      label: () => translate('SourceTitle'),
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
      name: 'indexer',
      label: () => translate('Indexer'),
      isSortable: true,
      isVisible: false,
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
      label: () => translate('All'),
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
      name: 'protocols',
      label: () => translate('Protocol'),
      type: filterBuilderTypes.EQUAL,
      valueType: filterBuilderValueTypes.PROTOCOL,
    },
  ],
});

export function useBlocklist() {
  return usePagedTable<Blocklist>({
    table: blocklistTable,
    path: BLOCKLIST_PATH,
    customFilterType: 'blocklist',
  });
}

// Whatever changes the blocklist makes the pages that were fetched stale
export function useInvalidateBlocklist() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    invalidateApiQueries(queryClient, BLOCKLIST_PATH);
  }, [queryClient]);
}

export function useRemoveBlocklistItem(id: number) {
  const invalidateBlocklist = useInvalidateBlocklist();

  const { mutate, isPending } = useApiMutation<unknown>({
    path: `${BLOCKLIST_PATH}/${id}`,
    method: 'DELETE',
    mutationOptions: { onSuccess: invalidateBlocklist },
  });

  return { removeItem: () => mutate(), isRemoving: isPending };
}

export function useRemoveBlocklistItems(onRemoved: () => void) {
  const invalidateBlocklist = useInvalidateBlocklist();

  const { mutate, isPending } = useApiMutation<unknown, { ids: number[] }>({
    path: `${BLOCKLIST_PATH}/bulk`,
    method: 'DELETE',
    sendBody: true,
    mutationOptions: {
      onSuccess: () => {
        invalidateBlocklist();
        onRemoved();
      },
    },
  });

  return { removeItems: mutate, isRemoving: isPending };
}
