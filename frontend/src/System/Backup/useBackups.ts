import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import useApiQuery, {
  ApiError,
  fetchApi,
  getApiPath,
  getApiQueryKey,
} from 'Helpers/Hooks/useApiQuery';
import Backup from 'typings/Backup';

export const BACKUPS_PATH = '/system/backup';

const NO_BACKUPS: Backup[] = [];

// The backups are fetched when the page is shown, and again when a backup has
// been made
export function useBackups() {
  const { data, isFetching, isSuccess, error, refetch } = useApiQuery<Backup[]>(
    {
      path: BACKUPS_PATH,
      queryOptions: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    }
  );

  return {
    items: data ?? NO_BACKUPS,
    isFetching,
    isPopulated: isSuccess,
    error,
    refetch,
  };
}

function removeBackup(queryClient: QueryClient, id: number) {
  queryClient.setQueriesData<Backup[]>(
    { queryKey: getApiQueryKey(BACKUPS_PATH) },
    (backups) => backups?.filter((backup) => backup.id !== id)
  );
}

export function useDeleteBackup() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<unknown, ApiError, number>({
    mutationFn: (id) =>
      fetchApi(getApiPath(`${BACKUPS_PATH}/${id}`), {
        method: 'DELETE',
        headers: { 'X-Api-Key': window.Radarr.apiKey },
      }),
    onSuccess: (_, id) => removeBackup(queryClient, id),
  });

  return { deleteBackup: mutate, isDeleting: isPending, deleteError: error };
}

interface RestoreBackupPayload {
  id?: number;
  file?: File;
}

// Restores a backup of the list, or one that is uploaded
export function useRestoreBackup() {
  const { mutate, isPending, error } = useMutation<
    unknown,
    ApiError | Error,
    RestoreBackupPayload
  >({
    mutationFn: ({ id, file }) => {
      const headers = { 'X-Api-Key': window.Radarr.apiKey };

      if (id) {
        return fetchApi(getApiPath(`${BACKUPS_PATH}/restore/${id}`), {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      }

      if (file) {
        const formData = new FormData();

        formData.append('restore', file);

        return fetchApi(getApiPath(`${BACKUPS_PATH}/restore/upload`), {
          method: 'POST',
          headers,
          body: formData,
        });
      }

      return Promise.reject(new Error('Error restoring backup'));
    },
  });

  return { restoreBackup: mutate, isRestoring: isPending, restoreError: error };
}
