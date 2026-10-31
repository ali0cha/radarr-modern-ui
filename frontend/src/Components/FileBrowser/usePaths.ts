import { keepPreviousData } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import { PathFile, PathFolder } from 'typings/Path';

export interface PathsRequest {
  path: string;
  allowFoldersWithoutTrailingSlashes?: boolean;
  includeFiles?: boolean;
}

interface PathsResponse {
  parent: string | null;
  directories: PathFolder[];
  files: PathFile[];
}

const NO_DIRECTORIES: PathFolder[] = [];
const NO_FILES: PathFile[] = [];

// A null request means nothing is fetched. The previous listing stays visible
// while the next one loads.
function usePaths(request: PathsRequest | null) {
  const {
    path = '',
    allowFoldersWithoutTrailingSlashes = false,
    includeFiles = false,
  } = request ?? {};

  const { data, isFetching, isSuccess, isPlaceholderData, error } =
    useApiQuery<PathsResponse>({
      path: `/filesystem?path=${encodeURIComponent(
        path
      )}&allowFoldersWithoutTrailingSlashes=${allowFoldersWithoutTrailingSlashes}&includeFiles=${includeFiles}`,
      queryOptions: {
        enabled: request !== null,
        placeholderData: keepPreviousData,
        retry: false,
        gcTime: 0,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    });

  // The path of the listing that is shown, which is the previous one while
  // the next one is loading.
  const lastShownPath = useRef('');
  const isShowingRequest = request !== null && isSuccess && !isPlaceholderData;

  useEffect(() => {
    if (isShowingRequest) {
      lastShownPath.current = path;
    }
  }, [isShowingRequest, path]);

  const currentPath = isShowingRequest ? path : lastShownPath.current;
  const directories = data?.directories ?? NO_DIRECTORIES;
  const files = data?.files ?? NO_FILES;

  const paths = useMemo(() => {
    return [...directories, ...files].filter((item) =>
      item.path.toLowerCase().startsWith(currentPath.toLowerCase())
    );
  }, [directories, files, currentPath]);

  return {
    isFetching,
    isPopulated: isSuccess,
    error: error ?? undefined,
    parent: data?.parent ?? null,
    currentPath,
    directories,
    files,
    paths,
  };
}

export default usePaths;
