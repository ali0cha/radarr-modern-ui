import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createPersist } from 'Helpers/createPersist';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery, { getApiPath } from 'Helpers/Hooks/useApiQuery';
import { ASCENDING, SortDirection } from 'Helpers/Props/sortDirections';
import { setMovie } from 'Movie/useMovies';
import { MovieFile } from 'MovieFile/MovieFile';

export const MOVIE_FILES_PATH = '/movieFile';

// The files are kept up to date by SignalR and by what is done to them
const movieFilesQueryOptions = {
  retry: false,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
};

const NO_MOVIE_FILES: MovieFile[] = [];

function getMovieFileKey(id: number) {
  return [
    getApiPath(`${MOVIE_FILES_PATH}/${id}`),
    { 'X-Api-Key': window.Radarr.apiKey },
  ];
}

// The files that a list brought are known one by one too
function useSeedMovieFiles(movieFiles: MovieFile[] | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    movieFiles?.forEach((movieFile) => {
      queryClient.setQueryData(getMovieFileKey(movieFile.id), movieFile);
    });
  }, [movieFiles, queryClient]);
}

// The files of a movie
export function useMovieFilesForMovie(movieId: number | undefined) {
  const { data, isFetching, isSuccess, error, refetch } = useApiQuery<
    MovieFile[]
  >({
    path: `${MOVIE_FILES_PATH}?movieId=${movieId}`,
    queryOptions: { ...movieFilesQueryOptions, enabled: !!movieId },
  });

  useSeedMovieFiles(data);

  return {
    items: data ?? NO_MOVIE_FILES,
    isFetching,
    isPopulated: isSuccess,
    error,
    refetch,
  };
}

// The files that some movies have, fetched all at once
export function useMovieFilesByIds(movieFileIds: number[]) {
  const query = movieFileIds.map((id) => `movieFileIds=${id}`).join('&');

  const { data, isFetching, isSuccess, error } = useApiQuery<MovieFile[]>({
    path: `${MOVIE_FILES_PATH}?${query}`,
    queryOptions: { ...movieFilesQueryOptions, enabled: !!movieFileIds.length },
  });

  useSeedMovieFiles(data);

  return {
    items: data ?? NO_MOVIE_FILES,
    isFetching,
    isPopulated: isSuccess,
    error,
  };
}

export function useMovieFile(movieFileId: number | undefined) {
  const { data } = useApiQuery<MovieFile>({
    path: `${MOVIE_FILES_PATH}/${movieFileId}`,
    queryOptions: { ...movieFilesQueryOptions, enabled: !!movieFileId },
  });

  return data;
}

function getMovieFileQueries(queryClient: QueryClient) {
  const prefix = getApiPath(MOVIE_FILES_PATH);

  return queryClient.getQueryCache().findAll({
    predicate: ({ queryKey }) =>
      typeof queryKey[0] === 'string' && queryKey[0].startsWith(prefix),
  });
}

// A file that was added or changed is applied to what was fetched
export function updateMovieFile(
  queryClient: QueryClient,
  movieFile: Partial<MovieFile> & { id: number }
) {
  getMovieFileQueries(queryClient).forEach(({ queryKey }) => {
    const url = queryKey[0] as string;

    queryClient.setQueryData<MovieFile | MovieFile[]>(queryKey, (data) => {
      if (Array.isArray(data)) {
        if (data.some(({ id }) => id === movieFile.id)) {
          return data.map((item) =>
            item.id === movieFile.id ? { ...item, ...movieFile } : item
          );
        }

        // A new file of a movie whose files were fetched
        return movieFile.movieId &&
          url.endsWith(`?movieId=${movieFile.movieId}`)
          ? [...data, movieFile as MovieFile]
          : data;
      }

      return data && data.id === movieFile.id
        ? { ...data, ...movieFile }
        : data;
    });
  });
}

export function removeMovieFiles(
  queryClient: QueryClient,
  movieFileIds: number[]
) {
  getMovieFileQueries(queryClient).forEach(({ queryKey }) => {
    const data = queryClient.getQueryData<MovieFile | MovieFile[]>(queryKey);

    if (Array.isArray(data)) {
      queryClient.setQueryData(
        queryKey,
        data.filter(({ id }) => !movieFileIds.includes(id))
      );
    } else if (data && movieFileIds.includes(data.id)) {
      queryClient.removeQueries({ queryKey, exact: true });
    }
  });
}

// The movies that had the files do not have them any more
function clearMovieFileOfMovies(
  queryClient: QueryClient,
  movies: { id: number; movieFileId: number }[],
  movieFileIds: number[]
) {
  movies
    .filter(({ movieFileId }) => movieFileIds.includes(movieFileId))
    .forEach(({ id }) =>
      setMovie(queryClient, { id, movieFileId: 0, hasFile: false })
    );
}

export function invalidateMovieFiles(queryClient: QueryClient) {
  getMovieFileQueries(queryClient).forEach(({ queryKey }) => {
    queryClient.invalidateQueries({ queryKey, exact: true });
  });
}

export function useDeleteMovieFile() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<unknown, number>({
    path: (movieFileId) => `${MOVIE_FILES_PATH}/${movieFileId}`,
    method: 'DELETE',
    mutationOptions: {
      onSuccess: (_data, movieFileId) => {
        removeMovieFiles(queryClient, [movieFileId]);
        applyMovieFileRemoval(queryClient, [movieFileId]);
      },
    },
  });

  return { deleteMovieFile: mutate, isDeleting: isPending, deleteError: error };
}

export function useDeleteMovieFiles() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<
    unknown,
    { movieFileIds: number[] }
  >({
    path: `${MOVIE_FILES_PATH}/bulk`,
    method: 'DELETE',
    sendBody: true,
    mutationOptions: {
      onSuccess: (_data, { movieFileIds }) => {
        removeMovieFiles(queryClient, movieFileIds);
        applyMovieFileRemoval(queryClient, movieFileIds);
      },
    },
  });

  return {
    deleteMovieFiles: mutate,
    isDeleting: isPending,
    deleteError: error,
  };
}

export function useUpdateMovieFiles(onSaved?: () => void) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<
    MovieFile[],
    Partial<MovieFile>[]
  >({
    path: `${MOVIE_FILES_PATH}/bulk`,
    method: 'PUT',
    mutationOptions: {
      onSuccess: (movieFiles) => {
        movieFiles.forEach((movieFile) =>
          updateMovieFile(queryClient, movieFile)
        );
        onSaved?.();
      },
    },
  });

  return { updateMovieFiles: mutate, isSaving: isPending, saveError: error };
}

// The movies of the library that had the removed files
function applyMovieFileRemoval(
  queryClient: QueryClient,
  movieFileIds: number[]
) {
  const movies = queryClient.getQueriesData<
    { id: number; movieFileId: number }[]
  >({ queryKey: [getApiPath('/movie')] });

  movies.forEach(([, data]) => {
    if (data) {
      clearMovieFileOfMovies(queryClient, data, movieFileIds);
    }
  });
}

interface MovieFilesTableState {
  sortKey: string;
  sortDirection: SortDirection;
  columns: { name: string; isVisible: boolean }[];
}

// The preferences of the table of the files of a movie
export const movieFilesTableStore = createPersist<
  MovieFilesTableState & {
    setSort: (sortKey: string, sortDirection?: SortDirection) => void;
    setColumns: (columns: { name: string; isVisible: boolean }[]) => void;
  }
>(
  'movie_files_table',
  (set) => ({
    sortKey: 'relativePath',
    sortDirection: ASCENDING,
    columns: [],

    setSort: (sortKey, sortDirection) =>
      set((state) => {
        if (sortDirection) {
          return { sortKey, sortDirection };
        }

        if (sortKey === state.sortKey) {
          return {
            sortKey,
            sortDirection:
              state.sortDirection === ASCENDING ? 'descending' : ASCENDING,
          };
        }

        return { sortKey, sortDirection: state.sortDirection };
      }),
    setColumns: (columns) =>
      set({
        columns: columns.map(({ name, isVisible }) => ({ name, isVisible })),
      }),
  }),
  {
    partialize: ({ sortKey, sortDirection, columns }) =>
      ({ sortKey, sortDirection, columns } as MovieFilesTableState & {
        setSort: never;
        setColumns: never;
      }),
    migrateFromLegacy: (legacyState) => {
      const legacy = legacyState.movieFiles as
        | Partial<MovieFilesTableState>
        | undefined;

      if (!legacy) {
        return undefined;
      }

      return {
        ...(legacy.sortKey ? { sortKey: legacy.sortKey } : {}),
        ...(legacy.sortDirection
          ? { sortDirection: legacy.sortDirection }
          : {}),
        ...(legacy.columns
          ? {
              columns: legacy.columns.map(({ name, isVisible }) => ({
                name,
                isVisible,
              })),
            }
          : {}),
      } as never;
    },
  }
);
