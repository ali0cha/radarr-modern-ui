import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import Column from 'Components/Table/Column';
import { createPagedTable } from 'Components/Table/pagedTable';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import { invalidateApiQueries } from 'Helpers/Hooks/useApiQuery';
import { filterTypes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

// SignalR tells that the movies of these pages may have changed
export const WANTED_POPULATE_REASONS = [
  'movieUpdated',
  'movieFileUpdated',
  'movieFileDeleted',
];

function monitoredFilter(key: string, label: string, value: boolean) {
  return {
    key,
    label: () => translate(label),
    filters: [{ key: 'monitored', value, type: filterTypes.EQUAL }],
  };
}

const releaseDateColumns: Column[] = [
  {
    name: 'movieMetadata.inCinemas',
    label: () => translate('InCinemas'),
    isSortable: true,
    isVisible: false,
  },
  {
    name: 'movieMetadata.digitalRelease',
    label: () => translate('DigitalRelease'),
    isSortable: true,
    isVisible: false,
  },
  {
    name: 'movieMetadata.physicalRelease',
    label: () => translate('PhysicalRelease'),
    isSortable: true,
    isVisible: false,
  },
];

// The columns that the missing and the cutoff unmet pages share: the extra
// ones go between the release dates and the last search.
export function createWantedTable(
  section: string,
  extraColumns: Column[] = []
) {
  return createPagedTable(section, {
    pageSize: 20,
    sortKey: 'movieMetadata.sortTitle',
    sortDirection: 'ascending',
    selectedFilterKey: 'monitored',

    columns: [
      {
        name: 'movieMetadata.sortTitle',
        label: () => translate('MovieTitle'),
        isSortable: true,
        isVisible: true,
      },
      {
        name: 'movieMetadata.year',
        label: () => translate('Year'),
        isSortable: true,
        isVisible: true,
      },
      ...releaseDateColumns,
      ...extraColumns,
      {
        name: 'movies.lastSearchTime',
        label: () => translate('LastSearched'),
        isSortable: true,
        isVisible: false,
      },
      {
        name: 'status',
        label: () => translate('Status'),
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
      monitoredFilter('monitored', 'Monitored', true),
      monitoredFilter('unmonitored', 'Unmonitored', false),
    ],

    filterBuilderProps: [],
  });
}

// Monitors or unmonitors the selected movies, and shows the page again
export function useToggleMonitoredMovies(path: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useApiMutation<
    unknown,
    { movieIds: number[]; monitored: boolean }
  >({
    path: '/movie/editor',
    method: 'PUT',
    mutationOptions: {
      onSuccess: () => invalidateApiQueries(queryClient, path),
    },
  });

  const toggleMonitored = useCallback(
    (movieIds: number[], monitored: boolean) => {
      mutate({ movieIds, monitored });
    },
    [mutate]
  );

  return { toggleMonitored, isSaving: isPending };
}
