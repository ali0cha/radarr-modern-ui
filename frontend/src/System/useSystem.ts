import { QueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { pingServer, setAppValue } from 'App/useAppStore';
import useApiQuery, {
  fetchApi,
  getApiPath,
  invalidateApiQueries,
} from 'Helpers/Hooks/useApiQuery';
import DiskSpace from 'typings/DiskSpace';
import Health from 'typings/Health';
import LogFile from 'typings/LogFile';
import Task from 'typings/Task';
import Update from 'typings/Update';

export const HEALTH_PATH = '/health';
export const DISK_SPACE_PATH = '/diskspace';
export const TASKS_PATH = '/system/task';
export const UPDATES_PATH = '/update';
export const LOG_FILES_PATH = '/log/file';
export const UPDATE_LOG_FILES_PATH = '/log/file/update';

// These are fetched when the page that shows them is, and again when what they
// show is known to have changed
const queryOptions = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

const NO_ITEMS: never[] = [];

function useSystemList<T>(path: string) {
  const { data, isFetching, isSuccess, error, refetch } = useApiQuery<T[]>({
    path,
    queryOptions,
  });

  return {
    items: data ?? (NO_ITEMS as T[]),
    isFetching,
    isPopulated: isSuccess,
    error,
    refetch,
  };
}

export const useHealth = () => useSystemList<Health>(HEALTH_PATH);
export const useDiskSpace = () => useSystemList<DiskSpace>(DISK_SPACE_PATH);
export const useTasks = () => useSystemList<Task>(TASKS_PATH);
export const useUpdates = () => useSystemList<Update>(UPDATES_PATH);
export const useLogFiles = () => useSystemList<LogFile>(LOG_FILES_PATH);
export const useUpdateLogFiles = () =>
  useSystemList<LogFile>(UPDATE_LOG_FILES_PATH);

export const invalidateHealth = (queryClient: QueryClient) =>
  invalidateApiQueries(queryClient, HEALTH_PATH);

export const invalidateTasks = (queryClient: QueryClient) =>
  invalidateApiQueries(queryClient, TASKS_PATH);

export const invalidateUpdates = (queryClient: QueryClient) =>
  invalidateApiQueries(queryClient, UPDATES_PATH);

// Restarts the application, and waits for it to be back
export function useRestart() {
  return useCallback(() => {
    return fetchApi(getApiPath('/system/restart'), {
      method: 'POST',
      headers: { 'X-Api-Key': window.Radarr.apiKey },
    }).then(
      () => {
        setAppValue({ isRestarting: true });
        pingServer();
      },
      () => undefined
    );
  }, []);
}

export function shutdown() {
  return fetchApi(getApiPath('/system/shutdown'), {
    method: 'POST',
    headers: { 'X-Api-Key': window.Radarr.apiKey },
  }).catch(() => undefined);
}
