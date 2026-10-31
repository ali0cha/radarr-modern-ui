import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery, {
  getApiPath,
  getApiQueryKey,
} from 'Helpers/Hooks/useApiQuery';
import RootFolder from 'typings/RootFolder';
import sortByProp from 'Utilities/Array/sortByProp';

const ROOT_FOLDERS_PATH = '/rootFolder';

// Root folders are fetched every time a screen needs them, but never because
// the window got the focus or the connection came back.
const rootFoldersQueryOptions = {
  retry: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

export function useRootFolders() {
  const { data, isFetching, isSuccess, error } = useApiQuery<RootFolder[]>({
    path: ROOT_FOLDERS_PATH,
    queryOptions: rootFoldersQueryOptions,
  });

  const items = useMemo(
    () => [...(data ?? [])].sort(sortByProp('path')),
    [data]
  );

  return { items, isFetching, isPopulated: isSuccess, error };
}

// For screens that do not show the root folders themselves but have forms that
// do, so that the list is already there when the form opens.
export function usePrefetchRootFolders() {
  useRootFolders();
}

// One root folder. Without a timeout the server waits for the scan of the
// unmapped folders to finish.
export function useRootFolder(id: number) {
  return useApiQuery<RootFolder>({
    path: `${ROOT_FOLDERS_PATH}/${id}?timeout=false`,
    queryOptions: rootFoldersQueryOptions,
  });
}

export function useAddRootFolder() {
  const queryClient = useQueryClient();

  return useApiMutation<RootFolder, { path: string }>({
    path: ROOT_FOLDERS_PATH,
    method: 'POST',
    mutationOptions: {
      onSuccess: (rootFolder) => {
        queryClient.setQueriesData<RootFolder[]>(
          { queryKey: getApiQueryKey(ROOT_FOLDERS_PATH) },
          (rootFolders) =>
            rootFolders
              ? [
                  ...rootFolders.filter(({ id }) => id !== rootFolder.id),
                  rootFolder,
                ]
              : rootFolders
        );
      },
    },
  });
}

export function useDeleteRootFolder() {
  const queryClient = useQueryClient();

  return useApiMutation<unknown, { id: number }>({
    path: ({ id }) => `${ROOT_FOLDERS_PATH}/${id}`,
    method: 'DELETE',
    mutationOptions: {
      onSuccess: (_data, { id }) => {
        queryClient.setQueriesData<RootFolder[]>(
          { queryKey: getApiQueryKey(ROOT_FOLDERS_PATH) },
          (rootFolders) =>
            rootFolders?.filter((rootFolder) => rootFolder.id !== id)
        );
      },
    },
  });
}

// For code outside of React. Also reaches the queries of a single root folder.
export function invalidateRootFolders(queryClient: QueryClient) {
  const prefix = getApiPath(ROOT_FOLDERS_PATH);

  return queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      typeof queryKey[0] === 'string' && queryKey[0].startsWith(prefix),
  });
}
