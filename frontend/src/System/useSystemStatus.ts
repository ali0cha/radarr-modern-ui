import { QueryClient } from '@tanstack/react-query';
import useApiQuery, { invalidateApiQueries } from 'Helpers/Hooks/useApiQuery';
import SystemStatus from 'typings/SystemStatus';

export const SYSTEM_STATUS_PATH = '/system/status';

const NO_SYSTEM_STATUS = {} as SystemStatus;

// The status of the system does not change while the app is shown, it is
// fetched when the app starts
export function useSystemStatusQuery() {
  const { data, isFetching, isSuccess, error } = useApiQuery<SystemStatus>({
    path: SYSTEM_STATUS_PATH,
    queryOptions: {
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  });

  return {
    status: data ?? NO_SYSTEM_STATUS,
    isFetching,
    isPopulated: isSuccess,
    error,
  };
}

export function invalidateSystemStatus(queryClient: QueryClient) {
  return invalidateApiQueries(queryClient, SYSTEM_STATUS_PATH);
}

function useSystemStatus() {
  return useSystemStatusQuery().status;
}

export default useSystemStatus;
