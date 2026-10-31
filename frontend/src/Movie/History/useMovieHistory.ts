import { useQueryClient } from '@tanstack/react-query';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery, { invalidateApiQueries } from 'Helpers/Hooks/useApiQuery';
import History from 'typings/History';

const MOVIE_HISTORY_PATH = '/history/movie';

export function useMovieHistory(movieId: number) {
  return useApiQuery<History[]>({
    path: `${MOVIE_HISTORY_PATH}?movieId=${movieId}`,
    queryOptions: {
      retry: false,
      // The history is dropped when the modal closes, like it used to be
      gcTime: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });
}

export function useMarkMovieHistoryAsFailed() {
  const queryClient = useQueryClient();

  return useApiMutation<unknown, { historyId: number }>({
    path: ({ historyId }) => `/history/failed/${historyId}`,
    method: 'POST',
    sendBody: false,
    mutationOptions: {
      onSuccess: () => invalidateApiQueries(queryClient, MOVIE_HISTORY_PATH),
    },
  });
}
