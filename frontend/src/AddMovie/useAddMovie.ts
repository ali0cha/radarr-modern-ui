import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { cloneDeep, get } from 'lodash';
import { useMemo } from 'react';
import { changeMissingMovies } from 'Collection/useMovieCollections';
import { createPersist } from 'Helpers/createPersist';
import useApiQuery, {
  ApiError,
  fetchApi,
  getApiPath,
} from 'Helpers/Hooks/useApiQuery';
import Movie, { MovieAvailability, MovieMonitor } from 'Movie/Movie';
import { setMovie } from 'Movie/useMovies';
import getNewMovie from 'Utilities/Movie/getNewMovie';

export const MOVIE_LOOKUP_PATH = '/movie/lookup';

export interface AddDefaults {
  rootFolderPath: string;
  monitor: MovieMonitor;
  qualityProfileId: number;
  minimumAvailability: MovieAvailability;
  searchForMovie: boolean;
  tags: number[];
}

interface AddMovieState {
  defaults: AddDefaults;
}

interface AddMovieActions {
  setDefaults: (defaults: Partial<AddDefaults>) => void;
}

// What was used the last time that a movie was added or imported, it is the
// starting point of the next one. Saved like it was in the Redux section of the
// same name.
export const useAddMovieStore = createPersist<AddMovieState & AddMovieActions>(
  'add_movie',
  (set) => ({
    defaults: {
      rootFolderPath: '',
      monitor: 'movieOnly',
      qualityProfileId: 0,
      minimumAvailability: 'released',
      searchForMovie: true,
      tags: [],
    },

    setDefaults: (defaults) =>
      set((state) => ({ defaults: { ...state.defaults, ...defaults } })),
  }),
  {
    partialize: (state) =>
      ({ defaults: state.defaults } as AddMovieState & AddMovieActions),
    // The defaults saved by older versions may lack the newest ones
    merge: (persisted, current) => ({
      ...current,
      defaults: {
        ...current.defaults,
        ...(persisted as Partial<AddMovieState> | undefined)?.defaults,
      },
    }),
    migrateFromLegacy: (legacyState) => {
      const defaults = get(legacyState, 'addMovie.defaults') as
        | AddDefaults
        | undefined;

      return defaults ? { defaults } : undefined;
    },
  }
);

export const useAddDefaults = () => useAddMovieStore((state) => state.defaults);

// For what is not a component, such as the thunks of the import
export function setAddDefaults(defaults: Partial<AddDefaults>) {
  useAddMovieStore.getState().setDefaults(defaults);
}

export interface LookupMovie extends Movie {
  // The id of the movie in the library, when it is in it
  internalId: number;
  folder: string;
  isExcluded?: boolean;
}

const NO_RESULTS: LookupMovie[] = [];

// The results are dropped when the search is cleared or the page is left, a
// movie that is searched for again is looked up again.
export function useMovieLookup(term: string) {
  const { data, isFetching, isSuccess, error, refetch } = useApiQuery<Movie[]>({
    path: `${MOVIE_LOOKUP_PATH}?term=${encodeURIComponent(term)}`,
    queryOptions: {
      enabled: !!term,
      retry: false,
      gcTime: 0,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  });

  const items = useMemo(
    () =>
      data
        ? (data.map((movie) => ({
            ...movie,
            internalId: movie.id,
            id: movie.tmdbId,
          })) as LookupMovie[])
        : NO_RESULTS,
    [data]
  );

  return {
    items,
    isFetching: !!term && isFetching,
    isPopulated: !!term && isSuccess,
    error: term ? error : null,
    refetch,
  };
}

function updateLookup(
  client: QueryClient,
  update: (movies: Movie[]) => Movie[]
) {
  const prefix = getApiPath(MOVIE_LOOKUP_PATH);

  client.setQueriesData<Movie[]>(
    {
      predicate: ({ queryKey }) =>
        typeof queryKey[0] === 'string' && queryKey[0].startsWith(prefix),
    },
    (movies) => (movies ? update(movies) : movies)
  );
}

function getLookupMovie(client: QueryClient, tmdbId: number) {
  const prefix = getApiPath(MOVIE_LOOKUP_PATH);

  return client
    .getQueriesData<Movie[]>({
      predicate: ({ queryKey }) =>
        typeof queryKey[0] === 'string' && queryKey[0].startsWith(prefix),
    })
    .flatMap(([, movies]) => movies ?? [])
    .find((movie) => movie.tmdbId === tmdbId);
}

export interface AddMoviePayload {
  tmdbId: number;
  rootFolderPath: string;
  monitor: MovieMonitor;
  qualityProfileId: number;
  minimumAvailability: MovieAvailability;
  searchForMovie?: boolean;
  tags: number[];
}

// Adds a movie of the search results to the library
export function useAddMovie() {
  const client = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    Movie,
    ApiError,
    AddMoviePayload
  >({
    mutationFn: (payload) => {
      const newMovie = getNewMovie(
        cloneDeep(getLookupMovie(client, payload.tmdbId)) as Movie,
        payload
      );

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
      setMovie(client, movie);

      // The result is now the movie of the library, but it keeps its images
      updateLookup(client, (movies) =>
        movies.map((item) =>
          item.tmdbId === movie.tmdbId
            ? { ...item, ...movie, images: item.images }
            : item
        )
      );

      if (movie.collection) {
        changeMissingMovies(client, movie.collection.tmdbId, -1);
      }
    },
  });

  return { addMovie: mutate, isAdding: isPending, addError: error };
}
