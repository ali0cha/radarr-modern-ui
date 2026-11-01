import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { cloneDeep, get } from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import { queryClient } from 'App/queryClient';
import { useCustomFilters } from 'Components/Filter/useCustomFilters';
import Column from 'Components/Table/Column';
import { mergeColumns } from 'Components/Table/pagedTable';
import { createPersist } from 'Helpers/createPersist';
import useApiQuery, {
  ApiError,
  fetchApi,
  getApiPath,
  invalidateApiQueries,
} from 'Helpers/Hooks/useApiQuery';
import {
  ASCENDING,
  DESCENDING,
  SortDirection,
} from 'Helpers/Props/sortDirections';
import Movie, { MovieAvailability, MovieMonitor } from 'Movie/Movie';
import { filterPredicates } from 'Movie/movieDefinitions';
import { setMovie } from 'Movie/useMovies';
import { IMPORT_LIST_EXCLUSIONS_PATH } from 'Settings/ImportLists/ImportListExclusions/useImportListExclusions';
import {
  filterItems,
  sortItems,
} from 'Store/Selectors/createClientSideCollectionSelector';
import getNewMovie from 'Utilities/Movie/getNewMovie';
import hasDifferentItemsOrOrder from 'Utilities/Object/hasDifferentItemsOrOrder';
import {
  columns as definedColumns,
  filterBuilderProps,
  filters,
  sortPredicates,
} from './discoverMovieDefinitions';

export { filterBuilderProps, filters };

export const DISCOVER_MOVIE_PATH = '/importlist/movie';

// A movie that an import list, the recommendations, the trending or the
// popular movies propose. The id is the TMDb id, so that the movie can be used
// like the ones of the library.
export interface DiscoverMovie extends Movie {
  lists: number[];
  isExisting: boolean;
  isExcluded: boolean;
  isRecommendation: boolean;
  isTrending: boolean;
  isPopular: boolean;
}

type FilterKey = string | number;

export interface DiscoverMovieOptions {
  includeRecommendations: boolean;
  includeTrending: boolean;
  includePopular: boolean;
}

export interface AddDefaults {
  rootFolderPath: string;
  monitor: MovieMonitor;
  qualityProfileId: number;
  minimumAvailability: MovieAvailability;
  searchForMovie: boolean;
  tags: number[];
}

export interface PosterOptions {
  size: string;
  showTitle: boolean;
  showTmdbRating: boolean;
  showImdbRating: boolean;
  showRottenTomatoesRating: boolean;
  showTraktRating: boolean;
}

export interface OverviewOptions {
  size: string;
  showYear: boolean;
  showStudio: boolean;
  showGenres: boolean;
  showTmdbRating: boolean;
  showImdbRating: boolean;
  showRottenTomatoesRating: boolean;
  showCertification: boolean;
}

interface StoredColumn {
  name: string;
  isVisible: boolean;
}

interface DiscoverMovieState {
  sortKey: string;
  sortDirection: SortDirection;
  secondarySortKey: string;
  secondarySortDirection: SortDirection;
  view: string;
  selectedFilterKey: FilterKey;
  options: DiscoverMovieOptions;
  defaults: AddDefaults;
  columns: StoredColumn[];
  posterOptions: PosterOptions;
  overviewOptions: OverviewOptions;
  tableOptions: Record<string, unknown>;
}

interface DiscoverMovieActions {
  setSort: (sortKey: string, sortDirection?: SortDirection) => void;
  setFilter: (selectedFilterKey: FilterKey) => void;
  setView: (view: string) => void;
  setOptions: (options: Partial<DiscoverMovieOptions>) => void;
  setDefaults: (defaults: Partial<AddDefaults>) => void;
  setTableOptions: (options: {
    columns?: Column[];
    tableOptions?: Record<string, unknown>;
  }) => void;
  setPosterOptions: (options: Partial<PosterOptions>) => void;
  setOverviewOptions: (options: Partial<OverviewOptions>) => void;
}

const PERSISTED_KEYS = [
  'sortKey',
  'sortDirection',
  'selectedFilterKey',
  'view',
  'options',
  'defaults',
  'columns',
  'posterOptions',
  'overviewOptions',
  'tableOptions',
] as const;

const defaultState: DiscoverMovieState = {
  sortKey: 'popularity',
  sortDirection: DESCENDING,
  secondarySortKey: 'sortTitle',
  secondarySortDirection: ASCENDING,
  view: 'overview',
  selectedFilterKey: 'newNotExcluded',

  options: {
    includeRecommendations: true,
    includeTrending: true,
    includePopular: true,
  },

  defaults: {
    rootFolderPath: '',
    monitor: 'movieOnly',
    qualityProfileId: 0,
    minimumAvailability: 'released',
    searchForMovie: true,
    tags: [],
  },

  columns: (definedColumns as Column[]).map(({ name, isVisible }) => ({
    name,
    isVisible,
  })),

  posterOptions: {
    size: 'large',
    showTitle: false,
    showTmdbRating: false,
    showImdbRating: false,
    showRottenTomatoesRating: false,
    showTraktRating: false,
  },

  overviewOptions: {
    size: 'medium',
    showYear: true,
    showStudio: true,
    showGenres: true,
    showTmdbRating: false,
    showImdbRating: false,
    showRottenTomatoesRating: false,
    showCertification: true,
  },

  tableOptions: {},
};

// The preferences of the page are saved like they were in the Redux section of
// the same name.
export const useDiscoverMovieStore = createPersist<
  DiscoverMovieState & DiscoverMovieActions
>(
  'discover_movie',
  (set) => ({
    ...defaultState,

    setSort: (sortKey, sortDirection) =>
      set((state) => {
        if (sortDirection) {
          return { sortKey, sortDirection };
        }

        // The same column again reverses the order
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
    setView: (view) => set({ view }),
    setOptions: (options) =>
      set((state) => ({ options: { ...state.options, ...options } })),
    setDefaults: (defaults) =>
      set((state) => ({ defaults: { ...state.defaults, ...defaults } })),
    setTableOptions: ({ columns, tableOptions }) =>
      set({
        ...(columns
          ? {
              columns: columns.map(({ name, isVisible }) => ({
                name,
                isVisible,
              })),
            }
          : {}),
        ...(tableOptions ? { tableOptions } : {}),
      }),
    setPosterOptions: (options) =>
      set((state) => ({
        posterOptions: { ...state.posterOptions, ...options },
      })),
    setOverviewOptions: (options) =>
      set((state) => ({
        overviewOptions: { ...state.overviewOptions, ...options },
      })),
  }),
  {
    partialize: (state) =>
      Object.fromEntries(
        PERSISTED_KEYS.map((key) => [key, state[key]])
      ) as unknown as DiscoverMovieState & DiscoverMovieActions,
    // The options saved by older versions may lack the newest ones
    merge: (persisted, current) => {
      const saved = (persisted ?? {}) as Partial<DiscoverMovieState>;

      return {
        ...current,
        ...saved,
        options: { ...current.options, ...saved.options },
        defaults: { ...current.defaults, ...saved.defaults },
        posterOptions: { ...current.posterOptions, ...saved.posterOptions },
        overviewOptions: {
          ...current.overviewOptions,
          ...saved.overviewOptions,
        },
        tableOptions: { ...current.tableOptions, ...saved.tableOptions },
      };
    },
    migrateFromLegacy: (legacyState) => {
      const legacy = get(legacyState, 'discoverMovie') as
        | Record<string, unknown>
        | undefined;

      if (!legacy) {
        return undefined;
      }

      const migrated: Record<string, unknown> = {};

      PERSISTED_KEYS.forEach((key) => {
        if (legacy[key] !== undefined) {
          migrated[key] =
            key === 'columns'
              ? (legacy.columns as Column[]).map(({ name, isVisible }) => ({
                  name,
                  isVisible,
                }))
              : legacy[key];
        }
      });

      return migrated as Partial<DiscoverMovieState & DiscoverMovieActions>;
    },
  }
);

export const useDiscoverMovieOptions = () =>
  useDiscoverMovieStore((state) => state.options);

export const useAddDefaults = () =>
  useDiscoverMovieStore((state) => state.defaults);

export const usePosterOptions = () =>
  useDiscoverMovieStore((state) => state.posterOptions);

export const useOverviewOptions = () =>
  useDiscoverMovieStore((state) => state.overviewOptions);

export function useDiscoverMovieColumns() {
  const storedColumns = useDiscoverMovieStore((state) => state.columns);

  return useMemo(
    () => mergeColumns(definedColumns as Column[], storedColumns),
    [storedColumns]
  );
}

function getDiscoverMoviePath({
  includeRecommendations,
  includeTrending,
  includePopular,
}: DiscoverMovieOptions) {
  return `${DISCOVER_MOVIE_PATH}?includeRecommendations=${includeRecommendations}&includeTrending=${includeTrending}&includePopular=${includePopular}`;
}

const NO_MOVIES: DiscoverMovie[] = [];

// The movies are dropped when the page is left, and are only fetched again by
// the page itself.
function useDiscoverMovieQuery() {
  const options = useDiscoverMovieOptions();

  return useApiQuery<DiscoverMovie[]>({
    path: getDiscoverMoviePath(options),
    queryOptions: {
      retry: false,
      gcTime: 0,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  });
}

export function useDiscoverMovies() {
  const { data, isFetching, isSuccess, error, refetch } =
    useDiscoverMovieQuery();

  const movies = useMemo(
    () =>
      data ? data.map((movie) => ({ ...movie, id: movie.tmdbId })) : NO_MOVIES,
    [data]
  );

  return {
    movies,
    isFetching,
    isPopulated: isSuccess,
    error,
    refetch,
  };
}

// Every movie of the views reads its own data, so it does not go through the
// whole list
export function useDiscoverMovie(tmdbId: number | undefined) {
  const { data } = useDiscoverMovieQuery();

  return useMemo(() => {
    const movie = tmdbId
      ? data?.find((item) => item.tmdbId === tmdbId)
      : undefined;

    return movie ? { ...movie, id: movie.tmdbId } : undefined;
  }, [data, tmdbId]);
}

function updateDiscoverMovies(
  client: QueryClient,
  update: (movies: DiscoverMovie[]) => DiscoverMovie[]
) {
  const prefix = getApiPath(DISCOVER_MOVIE_PATH);

  client.setQueriesData<DiscoverMovie[]>(
    {
      predicate: ({ queryKey }) =>
        typeof queryKey[0] === 'string' && queryKey[0].startsWith(prefix),
    },
    (movies) => (movies ? update(movies) : movies)
  );
}

function getDiscoverMovies(client: QueryClient) {
  const prefix = getApiPath(DISCOVER_MOVIE_PATH);

  const [, movies] = client.getQueriesData<DiscoverMovie[]>({
    predicate: ({ queryKey }) =>
      typeof queryKey[0] === 'string' && queryKey[0].startsWith(prefix),
  })[0] ?? [undefined, undefined];

  return movies ?? NO_MOVIES;
}

// A movie that was added is not new anymore, it is not shown at all when no
// list proposes it
function setAdded(client: QueryClient, tmdbIds: number[]) {
  updateDiscoverMovies(client, (movies) =>
    movies.reduce<DiscoverMovie[]>((acc, movie) => {
      if (!tmdbIds.includes(movie.tmdbId)) {
        acc.push(movie);
      } else if (movie.lists.length > 0) {
        acc.push({ ...movie, isExisting: true });
      }

      return acc;
    }, [])
  );
}

function setExcluded(client: QueryClient, tmdbIds: number[]) {
  updateDiscoverMovies(client, (movies) =>
    movies.map((movie) =>
      tmdbIds.includes(movie.tmdbId) ? { ...movie, isExcluded: true } : movie
    )
  );
}

// Called when the lists were synced: what they propose may have changed
export function refetchDiscoverMovies() {
  return invalidateApiQueries(queryClient, DISCOVER_MOVIE_PATH);
}

export interface AddDiscoverMovieOptions {
  rootFolderPath: string;
  monitor: MovieMonitor;
  qualityProfileId: number;
  minimumAvailability: MovieAvailability;
  searchForMovie?: boolean;
  tags: number[];
}

function postJson<T>(path: string, body: unknown, method = 'POST') {
  return fetchApi<T>(getApiPath(path), {
    method,
    headers: {
      'X-Api-Key': window.Radarr.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

interface AddDiscoverMoviePayload extends AddDiscoverMovieOptions {
  tmdbId: number;
}

// Adds one of the movies to the library
export function useAddDiscoverMovie(onAdded?: () => void) {
  const client = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    Movie,
    ApiError,
    AddDiscoverMoviePayload
  >({
    mutationFn: (payload) => {
      const item = getDiscoverMovies(client).find(
        ({ tmdbId }) => tmdbId === payload.tmdbId
      );

      const newMovie = getNewMovie(cloneDeep(item) as Movie, payload);

      newMovie.id = 0;

      return postJson<Movie>('/movie', newMovie);
    },
    onSuccess: (movie, { tmdbId }) => {
      setMovie(client, movie);
      setAdded(client, [tmdbId]);
      onAdded?.();
    },
  });

  return { addMovie: mutate, isAdding: isPending, addError: error };
}

interface AddDiscoverMoviesPayload {
  tmdbIds: number[];
  addOptions: AddDiscoverMovieOptions;
}

// Adds several of the movies to the library
export function useAddDiscoverMovies() {
  const client = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    Movie[],
    ApiError,
    AddDiscoverMoviesPayload
  >({
    mutationFn: ({ tmdbIds, addOptions }) => {
      const items = getDiscoverMovies(client);

      // Each movie is only added once, and not when it is already in the
      // library
      const newMovies = tmdbIds.reduce<Movie[]>((acc, tmdbId) => {
        const item = items.find((movie) => movie.tmdbId === tmdbId);

        if (item && !item.isExisting && !acc.some((a) => a.tmdbId === tmdbId)) {
          const newMovie = getNewMovie(cloneDeep(item) as Movie, addOptions);

          newMovie.id = 0;
          acc.push(newMovie);
        }

        return acc;
      }, []);

      return postJson<Movie[]>(DISCOVER_MOVIE_PATH, newMovies);
    },
    onSuccess: (movies) => {
      movies.forEach((movie) => setMovie(client, movie));
      setAdded(
        client,
        movies.map(({ tmdbId }) => tmdbId)
      );
    },
  });

  return { addMovies: mutate, isAdding: isPending, addError: error };
}

interface ImportListExclusion {
  tmdbId: number;
}

// Puts movies on the exclusion list, so that the lists do not propose them
export function useExcludeDiscoverMovies(onExcluded?: () => void) {
  const client = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    ImportListExclusion[],
    ApiError,
    number[]
  >({
    mutationFn: (tmdbIds) => {
      const items = getDiscoverMovies(client);

      const exclusions = tmdbIds.reduce<
        { tmdbId: number; movieTitle: string; movieYear: number }[]
      >((acc, tmdbId) => {
        const item = items.find((movie) => movie.tmdbId === tmdbId);

        if (item) {
          acc.push({
            tmdbId,
            movieTitle: item.title,
            movieYear: item.year,
          });
        }

        return acc;
      }, []);

      return postJson<ImportListExclusion[]>('/exclusions/bulk', exclusions);
    },
    onSuccess: (exclusions) => {
      setExcluded(
        client,
        exclusions.map(({ tmdbId }) => tmdbId)
      );
      invalidateApiQueries(client, IMPORT_LIST_EXCLUSIONS_PATH);
      onExcluded?.();
    },
  });

  return { excludeMovies: mutate, isExcluding: isPending, excludeError: error };
}

// What the page shows: the movies that pass the filter, in the order that was
// chosen. The movies are only listed by TMDb id: the views get their data
// themselves.
export function useDiscoverMovieView() {
  const { movies, isFetching, isPopulated, error, refetch } =
    useDiscoverMovies();

  const sortKey = useDiscoverMovieStore((state) => state.sortKey);
  const sortDirection = useDiscoverMovieStore((state) => state.sortDirection);
  const secondarySortKey = useDiscoverMovieStore(
    (state) => state.secondarySortKey
  );
  const secondarySortDirection = useDiscoverMovieStore(
    (state) => state.secondarySortDirection
  );
  const selectedFilterKey = useDiscoverMovieStore(
    (state) => state.selectedFilterKey
  );
  const view = useDiscoverMovieStore((state) => state.view);
  const options = useDiscoverMovieOptions();
  const columns = useDiscoverMovieColumns();

  const { customFilters: allCustomFilters } = useCustomFilters();

  const customFilters = useMemo(
    () => allCustomFilters.filter(({ type }) => type === 'discoverMovie'),
    [allCustomFilters]
  );

  const filteredMovies: DiscoverMovie[] = useMemo(() => {
    const filtered = filterItems(movies, {
      selectedFilterKey,
      filters,
      customFilters,
      filterPredicates,
    }) as DiscoverMovie[];

    return sortItems(filtered, {
      sortKey,
      sortDirection,
      sortPredicates,
      secondarySortKey,
      secondarySortDirection,
    }) as DiscoverMovie[];
  }, [
    movies,
    selectedFilterKey,
    customFilters,
    sortKey,
    sortDirection,
    secondarySortKey,
    secondarySortDirection,
  ]);

  const itemsRef = useRef<DiscoverMovie[]>([]);

  const items = useMemo(() => {
    const trimmed = filteredMovies.map(({ tmdbId, sortTitle }) => ({
      tmdbId,
      sortTitle,
    })) as unknown as DiscoverMovie[];

    if (hasDifferentItemsOrOrder(itemsRef.current, trimmed, 'tmdbId')) {
      itemsRef.current = trimmed;
    }

    return itemsRef.current;
  }, [filteredMovies]);

  const handleSortSelect = useCallback((key: string) => {
    useDiscoverMovieStore.getState().setSort(key);
  }, []);

  const handleFilterSelect = useCallback((key: FilterKey) => {
    useDiscoverMovieStore.getState().setFilter(key);
  }, []);

  const handleViewSelect = useCallback((newView: string) => {
    useDiscoverMovieStore.getState().setView(newView);
  }, []);

  return {
    ...options,
    isFetching,
    isPopulated,
    error,
    refetch,
    totalItems: movies.length,
    items,
    columns,
    selectedFilterKey,
    filters,
    customFilters,
    sortKey,
    sortDirection,
    view,
    handleSortSelect,
    handleFilterSelect,
    handleViewSelect,
  };
}
