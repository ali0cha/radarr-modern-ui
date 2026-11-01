import { get } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { create } from 'zustand';
import { useCustomFilters } from 'Components/Filter/useCustomFilters';
import { createPersist } from 'Helpers/createPersist';
import useApiQuery, { fetchApi, getApiPath } from 'Helpers/Hooks/useApiQuery';
import { ASCENDING, SortDirection } from 'Helpers/Props/sortDirections';
import {
  filterItems,
  sortItems,
} from 'Store/Selectors/createClientSideCollectionSelector';
import Release from 'typings/Release';
import InteractiveSearchPayload from './InteractiveSearchPayload';
import {
  filterBuilderProps,
  filterPredicates,
  filters,
  sortPredicates,
} from './releaseDefinitions';

export { filterBuilderProps };

export const RELEASES_PATH = '/release';

interface GrabState {
  isGrabbing: boolean;
  isGrabbed: boolean;
  grabError?: string;
}

interface GrabStatesStore {
  states: Record<string, GrabState>;
  setState: (guid: string, state: GrabState) => void;
  clear: () => void;
}

// How grabbing each release went, for as long as the releases are shown
const useGrabStates = create<GrabStatesStore>((set) => ({
  states: {},
  setState: (guid, state) =>
    set((current) => ({ states: { ...current.states, [guid]: state } })),
  clear: () => set({ states: {} }),
}));

// Sends the release to the download client: the server tells how it went
export function grabRelease(
  payload: { guid: string } & Record<string, unknown>
) {
  const { guid } = payload;
  const { setState } = useGrabStates.getState();

  setState(guid, { isGrabbing: true, isGrabbed: false });

  return fetchApi<unknown>(getApiPath(RELEASES_PATH), {
    method: 'POST',
    headers: {
      'X-Api-Key': window.Radarr.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(
    () => setState(guid, { isGrabbing: false, isGrabbed: true }),
    (error: { statusBody?: { message?: string } }) =>
      setState(guid, {
        isGrabbing: false,
        isGrabbed: false,
        grabError:
          error.statusBody?.message ?? 'Failed to add to download queue',
      })
  );
}

interface ReleasesFilterState {
  selectedFilterKey: string | number;
  setFilter: (selectedFilterKey: string | number) => void;
}

// The filter that was chosen is remembered, like it was in Redux
export const useReleasesFilterStore = createPersist<ReleasesFilterState>(
  'releases_filter',
  (set) => ({
    selectedFilterKey: 'all',
    setFilter: (selectedFilterKey) => set({ selectedFilterKey }),
  }),
  {
    partialize: ({ selectedFilterKey }) =>
      ({ selectedFilterKey } as ReleasesFilterState),
    migrateFromLegacy: (legacyState) => {
      const key = get(legacyState, 'releases.selectedFilterKey');

      return key ? { selectedFilterKey: key as string | number } : undefined;
    },
  }
);

const NO_RELEASES: Release[] = [];

// The releases that the indexers found for a movie. They are not kept once they
// are not shown any more, and the request is cancelled if it is still running.
export function useReleases(searchPayload: InteractiveSearchPayload) {
  const params = new URLSearchParams(
    Object.entries(searchPayload).map(([key, value]) => [key, String(value)])
  );

  const { data, isFetching, isSuccess, error } = useApiQuery<Release[]>({
    path: `${RELEASES_PATH}?${params.toString()}`,
    queryOptions: {
      retry: false,
      gcTime: 0,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  });

  const grabStates = useGrabStates((state) => state.states);

  const selectedFilterKey = useReleasesFilterStore(
    (state) => state.selectedFilterKey
  );
  const setFilter = useReleasesFilterStore((state) => state.setFilter);

  const [sort, setSort] = useState<{
    sortKey: string;
    sortDirection: SortDirection;
  }>({ sortKey: 'releaseWeight', sortDirection: ASCENDING });

  const { customFilters: allCustomFilters } = useCustomFilters();

  const customFilters = useMemo(
    () => allCustomFilters.filter(({ type }) => type === 'releases'),
    [allCustomFilters]
  );

  const releases = useMemo(
    () =>
      (data ?? NO_RELEASES).map((release) => ({
        ...release,
        ...grabStates[release.guid],
      })),
    [data, grabStates]
  );

  const items = useMemo(() => {
    const filtered = filterItems(releases, {
      selectedFilterKey,
      filters,
      customFilters,
      filterPredicates,
    }) as Release[];

    return sortItems(filtered, {
      sortKey: sort.sortKey,
      sortDirection: sort.sortDirection,
      sortPredicates,
    }) as Release[];
  }, [releases, selectedFilterKey, customFilters, sort]);

  const handleSortPress = useCallback(
    (sortKey: string, sortDirection?: SortDirection) => {
      setSort((current) => {
        if (sortDirection) {
          return { sortKey, sortDirection };
        }

        if (sortKey === current.sortKey) {
          return {
            sortKey,
            sortDirection:
              current.sortDirection === ASCENDING ? 'descending' : ASCENDING,
          };
        }

        return { sortKey, sortDirection: current.sortDirection };
      });
    },
    []
  );

  return {
    isFetching,
    isPopulated: isSuccess,
    error,
    items,
    allItems: releases,
    totalItems: releases.length,
    selectedFilterKey,
    filters,
    customFilters,
    sortKey: sort.sortKey,
    sortDirection: sort.sortDirection,
    handleFilterSelect: setFilter,
    handleSortPress,
  };
}

// The grabbing states are forgotten when the releases are not shown any more
export function clearGrabStates() {
  useGrabStates.getState().clear();
}
