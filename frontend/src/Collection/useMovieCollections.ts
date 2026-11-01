import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { get } from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import { useCustomFilters } from 'Components/Filter/useCustomFilters';
import { createPersist } from 'Helpers/createPersist';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery, {
  ApiError,
  fetchApi,
  getApiPath,
  getApiQueryKey,
  invalidateApiQueries,
} from 'Helpers/Hooks/useApiQuery';
import {
  ASCENDING,
  DESCENDING,
  SortDirection,
} from 'Helpers/Props/sortDirections';
import Movie, { MovieAvailability, MovieMonitor } from 'Movie/Movie';
import { setMovie } from 'Movie/useMovies';
import {
  filterItems,
  sortItems,
} from 'Store/Selectors/createClientSideCollectionSelector';
import MovieCollection from 'typings/MovieCollection';
import getNewMovie from 'Utilities/Movie/getNewMovie';
import hasDifferentItemsOrOrder from 'Utilities/Object/hasDifferentItemsOrOrder';
import {
  filterBuilderProps,
  filterPredicates,
  filters,
} from './movieCollectionDefinitions';

export { filterBuilderProps, filters };

export const COLLECTIONS_PATH = '/collection';

// The collections are kept up to date by SignalR
const collectionsQueryOptions = {
  retry: false,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

const NO_COLLECTIONS: MovieCollection[] = [];

export function useMovieCollections() {
  const { data, isFetching, isSuccess, error, refetch } = useApiQuery<
    MovieCollection[]
  >({
    path: COLLECTIONS_PATH,
    queryOptions: collectionsQueryOptions,
  });

  return {
    collections: data ?? NO_COLLECTIONS,
    isFetching,
    isPopulated: isSuccess,
    error,
    refetch,
  };
}

export function useMovieCollection(collectionId: number | undefined) {
  const { collections } = useMovieCollections();

  return useMemo(
    () =>
      collectionId
        ? collections.find(({ id }) => id === collectionId)
        : undefined,
    [collections, collectionId]
  );
}

export function useCollectionByTmdbId(tmdbId: number) {
  const { collections } = useMovieCollections();

  return useMemo(
    () => collections.find((collection) => collection.tmdbId === tmdbId),
    [collections, tmdbId]
  );
}

export function setMovieCollection(
  queryClient: QueryClient,
  changes: Partial<MovieCollection> & { id: number }
) {
  queryClient.setQueriesData<MovieCollection[]>(
    { queryKey: getApiQueryKey(COLLECTIONS_PATH) },
    (collections) => {
      if (!collections) {
        return collections;
      }

      return collections.some(({ id }) => id === changes.id)
        ? collections.map((collection) =>
            collection.id === changes.id
              ? { ...collection, ...changes }
              : collection
          )
        : [...collections, changes as MovieCollection];
    }
  );
}

export function removeMovieCollection(queryClient: QueryClient, id: number) {
  queryClient.setQueriesData<MovieCollection[]>(
    { queryKey: getApiQueryKey(COLLECTIONS_PATH) },
    (collections) => collections?.filter((collection) => collection.id !== id)
  );
}

export function invalidateMovieCollections(queryClient: QueryClient) {
  return invalidateApiQueries(queryClient, COLLECTIONS_PATH);
}

// A movie of the collection was added (or removed): one more (or less) is
// missing
export function changeMissingMovies(
  queryClient: QueryClient,
  collectionTmdbId: number,
  change: number
) {
  const [, collections] = queryClient.getQueriesData<MovieCollection[]>({
    queryKey: getApiQueryKey(COLLECTIONS_PATH),
  })[0] ?? [undefined, undefined];

  const collection = collections?.find(
    ({ tmdbId }) => tmdbId === collectionTmdbId
  );

  if (collection) {
    setMovieCollection(queryClient, {
      id: collection.id,
      missingMovies: Math.max(0, collection.missingMovies + change),
    });
  }
}

export function useSaveMovieCollection(
  collectionId: number,
  onSaved?: () => void
) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    MovieCollection,
    ApiError,
    MovieCollection
  >({
    mutationFn: (collection) =>
      fetchApi<MovieCollection>(
        getApiPath(`${COLLECTIONS_PATH}/${collectionId}`),
        {
          method: 'PUT',
          headers: {
            'X-Api-Key': window.Radarr.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(collection),
        }
      ),
    onSuccess: (collection) => {
      setMovieCollection(queryClient, collection);
      onSaved?.();
    },
  });

  return {
    saveCollection: mutate,
    isSaving: isPending,
    saveError: error,
  };
}

interface SaveCollectionsPayload {
  collectionIds: number[];
  monitored?: boolean;
  monitor?: string;
  qualityProfileId?: number;
  minimumAvailability?: string;
  rootFolderPath?: string;
  searchOnAdd?: boolean;
}

// Changes the same properties of several collections
export function useSaveMovieCollections() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<
    unknown,
    Record<string, unknown>
  >({
    path: COLLECTIONS_PATH,
    method: 'PUT',
    mutationOptions: {
      onSuccess: () => invalidateMovieCollections(queryClient),
    },
  });

  const saveCollections = useCallback(
    (payload: SaveCollectionsPayload) => {
      const {
        collectionIds,
        monitored,
        monitor,
        qualityProfileId,
        minimumAvailability,
        rootFolderPath,
        searchOnAdd,
      } = payload;

      const body: Record<string, unknown> = {};

      if ('monitored' in payload) {
        body.monitored = monitored;
      }

      if ('monitor' in payload) {
        body.monitorMovies = monitor === 'monitored';
      }

      if ('qualityProfileId' in payload) {
        body.qualityProfileId = qualityProfileId;
      }

      if ('minimumAvailability' in payload) {
        body.minimumAvailability = minimumAvailability;
      }

      if ('searchOnAdd' in payload) {
        body.searchOnAdd = searchOnAdd;
      }

      body.rootFolderPath = rootFolderPath;
      body.collectionIds = collectionIds;

      mutate(body);
    },
    [mutate]
  );

  return { saveCollections, isSaving: isPending, saveError: error };
}

export function useToggleCollectionMonitored(collectionId: number) {
  const queryClient = useQueryClient();
  const collection = useMovieCollection(collectionId);

  const { mutate, isPending } = useApiMutation<
    MovieCollection,
    MovieCollection
  >({
    path: ({ id }) => `${COLLECTIONS_PATH}/${id}`,
    method: 'PUT',
    mutationOptions: {
      onSuccess: (updated) => setMovieCollection(queryClient, updated),
    },
  });

  const toggleMonitored = useCallback(
    (monitored: boolean) => {
      if (collection) {
        mutate({ ...collection, monitored });
      }
    },
    [collection, mutate]
  );

  return { toggleMonitored, isSaving: isPending };
}

interface AddCollectionMoviePayload {
  tmdbId: number;
  title: string;
  rootFolderPath: string;
  monitor: MovieMonitor;
  qualityProfileId: number;
  minimumAvailability: MovieAvailability;
  searchForMovie?: boolean;
  tags: number[];
}

// Adds a movie of a collection to the library
export function useAddCollectionMovie(onAdded?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    Movie,
    ApiError,
    AddCollectionMoviePayload
  >({
    mutationFn: (payload) => {
      const { tmdbId, title } = payload;
      const newMovie = getNewMovie({ tmdbId, title } as Movie, payload);

      newMovie.id = 0;

      return fetchApi<Movie>(getApiPath('/movie'), {
        method: 'POST',
        headers: {
          'X-Api-Key': window.Radarr.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });
    },
    onSuccess: (movie) => {
      setMovie(queryClient, movie);

      if (movie.collection) {
        changeMissingMovies(queryClient, movie.collection.tmdbId, -1);
      }

      onAdded?.();
    },
  });

  return { addMovie: mutate, isAdding: isPending, addError: error };
}

interface OverviewOptions {
  detailedProgressBar: boolean;
  size: string;
  showDetails: boolean;
  showOverview: boolean;
  showPosters: boolean;
}

interface MovieCollectionsState {
  sortKey: string;
  sortDirection: SortDirection;
  secondarySortKey: string;
  secondarySortDirection: SortDirection;
  view: string;
  selectedFilterKey: string | number;
  overviewOptions: OverviewOptions;
  options: Record<string, unknown>;
}

interface MovieCollectionsActions {
  setSort: (sortKey: string, sortDirection?: SortDirection) => void;
  setFilter: (selectedFilterKey: string | number) => void;
  setOverviewOptions: (options: Partial<OverviewOptions>) => void;
  setOptions: (options: Record<string, unknown>) => void;
}

const PERSISTED_KEYS = [
  'sortKey',
  'sortDirection',
  'selectedFilterKey',
  'overviewOptions',
  'options',
] as const;

// The preferences of the collections page are saved like they were in the Redux
// section of the same name.
export const useMovieCollectionsStore = createPersist<
  MovieCollectionsState & MovieCollectionsActions
>(
  'movie_collections',
  (set) => ({
    sortKey: 'sortTitle',
    sortDirection: ASCENDING,
    secondarySortKey: 'sortTitle',
    secondarySortDirection: ASCENDING,
    view: 'overview',
    selectedFilterKey: 'all',
    overviewOptions: {
      detailedProgressBar: true,
      size: 'medium',
      showDetails: true,
      showOverview: true,
      showPosters: true,
    },
    options: {},

    setSort: (sortKey, sortDirection) =>
      set((state) => {
        if (sortDirection) {
          return { sortKey, sortDirection };
        }

        if (sortKey === state.sortKey) {
          return {
            sortKey,
            sortDirection:
              state.sortDirection === ASCENDING ? DESCENDING : ASCENDING,
          };
        }

        return { sortKey, sortDirection: state.sortDirection };
      }),
    setFilter: (selectedFilterKey) => set({ selectedFilterKey }),
    setOverviewOptions: (options) =>
      set((state) => ({
        overviewOptions: { ...state.overviewOptions, ...options },
      })),
    setOptions: (options) =>
      set((state) => ({ options: { ...state.options, ...options } })),
  }),
  {
    partialize: (state) =>
      Object.fromEntries(
        PERSISTED_KEYS.map((key) => [key, state[key]])
      ) as unknown as MovieCollectionsState & MovieCollectionsActions,
    merge: (persisted, current) => {
      const saved = (persisted ?? {}) as Partial<MovieCollectionsState>;

      return {
        ...current,
        ...saved,
        overviewOptions: {
          ...current.overviewOptions,
          ...saved.overviewOptions,
        },
        options: { ...current.options, ...saved.options },
      };
    },
    migrateFromLegacy: (legacyState) => {
      const legacy = get(legacyState, 'movieCollections') as
        | Record<string, unknown>
        | undefined;

      if (!legacy) {
        return undefined;
      }

      const migrated: Record<string, unknown> = {};

      PERSISTED_KEYS.forEach((key) => {
        if (legacy[key] !== undefined) {
          migrated[key] = legacy[key];
        }
      });

      return migrated as Partial<
        MovieCollectionsState & MovieCollectionsActions
      >;
    },
  }
);

// What the page shows: the collections that pass the filter, in the order that
// was chosen. They are only listed by id, the views get their data themselves.
export function useMovieCollectionsView() {
  const { collections, isFetching, isPopulated, error } = useMovieCollections();

  const sortKey = useMovieCollectionsStore((state) => state.sortKey);
  const sortDirection = useMovieCollectionsStore(
    (state) => state.sortDirection
  );
  const secondarySortKey = useMovieCollectionsStore(
    (state) => state.secondarySortKey
  );
  const secondarySortDirection = useMovieCollectionsStore(
    (state) => state.secondarySortDirection
  );
  const selectedFilterKey = useMovieCollectionsStore(
    (state) => state.selectedFilterKey
  );
  const view = useMovieCollectionsStore((state) => state.view);

  const { customFilters: allCustomFilters } = useCustomFilters();

  const customFilters = useMemo(
    () => allCustomFilters.filter(({ type }) => type === 'movieCollections'),
    [allCustomFilters]
  );

  const sortedCollections: MovieCollection[] = useMemo(() => {
    const filtered = filterItems(collections, {
      selectedFilterKey,
      filters,
      customFilters,
      filterPredicates,
    }) as MovieCollection[];

    return sortItems(filtered, {
      sortKey,
      sortDirection,
      secondarySortKey,
      secondarySortDirection,
    }) as MovieCollection[];
  }, [
    collections,
    selectedFilterKey,
    customFilters,
    sortKey,
    sortDirection,
    secondarySortKey,
    secondarySortDirection,
  ]);

  const itemsRef = useRef<MovieCollection[]>([]);

  const items = useMemo(() => {
    const trimmed = sortedCollections.map(({ id, sortTitle }) => ({
      id,
      sortTitle,
    })) as unknown as MovieCollection[];

    if (hasDifferentItemsOrOrder(itemsRef.current, trimmed)) {
      itemsRef.current = trimmed;
    }

    return itemsRef.current;
  }, [sortedCollections]);

  return {
    isFetching,
    isPopulated,
    error,
    totalItems: collections.length,
    items,
    selectedFilterKey,
    filters,
    customFilters,
    sortKey,
    sortDirection,
    view,
  };
}
