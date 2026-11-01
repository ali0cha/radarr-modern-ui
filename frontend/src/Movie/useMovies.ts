import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { createPersist } from 'Helpers/createPersist';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery, {
  ApiError,
  fetchApi,
  getApiPath,
  getApiQueryKey,
  invalidateApiQueries,
} from 'Helpers/Hooks/useApiQuery';
import Movie from 'Movie/Movie';

export const MOVIES_PATH = '/movie';

// The whole library is fetched once. SignalR tells when a movie changes, so it
// is not fetched again because the window got the focus.
const moviesQueryOptions = {
  retry: false,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

const NO_MOVIES: Movie[] = [];

export function useMovies() {
  const { data, isFetching, isSuccess, error, refetch } = useApiQuery<Movie[]>({
    path: MOVIES_PATH,
    queryOptions: moviesQueryOptions,
  });

  return {
    movies: data ?? NO_MOVIES,
    isFetching,
    isPopulated: isSuccess,
    error,
    refetch,
  };
}

// The movies by id, built once for each version of the library
const moviesById = new WeakMap<Movie[], Map<number, Movie>>();

function getMoviesById(movies: Movie[]) {
  let map = moviesById.get(movies);

  if (!map) {
    map = new Map(movies.map((movie) => [movie.id, movie]));
    moviesById.set(movies, map);
  }

  return map;
}

export function useMovie(movieId: number | undefined) {
  const { movies } = useMovies();

  return movieId ? getMoviesById(movies).get(movieId) : undefined;
}

export function useMultiMovies(movieIds: number[]) {
  const { movies } = useMovies();

  return useMemo(() => {
    const map = getMoviesById(movies);

    return movieIds.reduce<Movie[]>((acc, movieId) => {
      const movie = map.get(movieId);

      if (movie) {
        acc.push(movie);
      }

      return acc;
    }, []);
  }, [movies, movieIds]);
}

export function useMoviesFetching() {
  const { isFetching, isPopulated, error } = useMovies();

  return {
    isMoviesFetching: isFetching,
    isMoviesPopulated: isPopulated,
    moviesError: error,
  };
}

export function useMovieCount() {
  const { movies, isFetching, isPopulated, error } = useMovies();

  return { count: movies.length, isFetching, isPopulated, error };
}

export function useExistingMovie(tmdbId: number) {
  const { movies } = useMovies();

  return useMemo(
    () => movies.some((movie) => movie.tmdbId === tmdbId),
    [movies, tmdbId]
  );
}

// What changes in the library is applied to the movies that were fetched
export function setMovie(queryClient: QueryClient, changes: Partial<Movie>) {
  queryClient.setQueriesData<Movie[]>(
    { queryKey: getApiQueryKey(MOVIES_PATH) },
    (movies) => {
      if (!movies) {
        return movies;
      }

      const exists = movies.some(({ id }) => id === changes.id);

      return exists
        ? movies.map((movie) =>
            movie.id === changes.id ? { ...movie, ...changes } : movie
          )
        : [...movies, changes as Movie];
    }
  );
}

export function removeMovies(queryClient: QueryClient, movieIds: number[]) {
  queryClient.setQueriesData<Movie[]>(
    { queryKey: getApiQueryKey(MOVIES_PATH) },
    (movies) => movies?.filter(({ id }) => !movieIds.includes(id))
  );
}

export function invalidateMovies(queryClient: QueryClient) {
  return invalidateApiQueries(queryClient, MOVIES_PATH);
}

interface DeleteOptionsState {
  addImportExclusion: boolean;
}

// What was chosen the last time movies were deleted
const deleteOptionsStore = createPersist<DeleteOptionsState>(
  'movies_delete_options',
  () => ({ addImportExclusion: false }),
  {
    migrateFromLegacy: (legacyState) => {
      const options = (
        legacyState.movies as { deleteOptions?: Partial<DeleteOptionsState> }
      )?.deleteOptions;

      return typeof options?.addImportExclusion === 'boolean'
        ? { addImportExclusion: options.addImportExclusion }
        : undefined;
    },
  }
);

export const useDeleteOptions = () => deleteOptionsStore((state) => state);

export const setDeleteOptions = (options: DeleteOptionsState) =>
  deleteOptionsStore.setState(options);

export function useSaveMovie(onSaved?: (movie: Movie) => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    Movie,
    ApiError,
    { movie: Movie; moveFiles?: boolean }
  >({
    mutationFn: ({ movie, moveFiles }) =>
      fetchApi<Movie>(
        getApiPath(
          `${MOVIES_PATH}/${movie.id}${moveFiles ? '?moveFiles=true' : ''}`
        ),
        {
          method: 'PUT',
          headers: {
            'X-Api-Key': window.Radarr.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movie),
        }
      ),
    onSuccess: (movie) => {
      setMovie(queryClient, movie);
      onSaved?.(movie);
    },
  });

  return { saveMovie: mutate, isSaving: isPending, saveError: error };
}

export function useDeleteMovie(movieId: number, onDeleted?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useApiMutation<
    unknown,
    { deleteFiles: boolean; addImportExclusion: boolean }
  >({
    path: ({ deleteFiles, addImportExclusion }) =>
      `${MOVIES_PATH}/${movieId}?deleteFiles=${deleteFiles}&addImportExclusion=${addImportExclusion}`,
    method: 'DELETE',
    mutationOptions: {
      onSuccess: () => {
        removeMovies(queryClient, [movieId]);
        onDeleted?.();
      },
    },
  });

  return { deleteMovie: mutate, isDeleting: isPending };
}

export function useToggleMovieMonitored(movieId: number) {
  const queryClient = useQueryClient();
  const movie = useMovie(movieId);

  const { mutate, isPending } = useApiMutation<Movie, Movie>({
    path: ({ id }) => `${MOVIES_PATH}/${id}`,
    method: 'PUT',
    mutationOptions: {
      onSuccess: (updated) => setMovie(queryClient, updated),
    },
  });

  // The whole movie is sent, with the monitored flag changed
  const toggleMonitored = useCallback(
    (monitored: boolean) => {
      if (movie) {
        mutate({ ...movie, monitored });
      }
    },
    [movie, mutate]
  );

  return { toggleMonitored, isSaving: isPending };
}

interface MovieEditorPayload {
  movieIds: number[];
  [key: string]: unknown;
}

// Changes the same properties of several movies, the server answers with them
export function useMovieEditor(onSaved?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<
    Movie[],
    MovieEditorPayload
  >({
    path: `${MOVIES_PATH}/editor`,
    method: 'PUT',
    mutationOptions: {
      onSuccess: (movies) => {
        movies.forEach((movie) => setMovie(queryClient, movie));
        onSaved?.();
      },
    },
  });

  return { saveEditor: mutate, isSavingEditor: isPending, editorError: error };
}

export function useBulkDeleteMovies(onDeleted?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<
    unknown,
    { movieIds: number[]; deleteFiles: boolean; addImportExclusion: boolean }
  >({
    path: `${MOVIES_PATH}/editor`,
    method: 'DELETE',
    sendBody: true,
    mutationOptions: {
      onSuccess: (_data, { movieIds }) => {
        removeMovies(queryClient, movieIds);
        onDeleted?.();
      },
    },
  });

  return { bulkDelete: mutate, isDeleting: isPending, deleteError: error };
}
