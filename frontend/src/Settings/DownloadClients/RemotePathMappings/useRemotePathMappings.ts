import { useMemo } from 'react';
import { useProviderSettings } from 'Settings/useProviderSettings';
import RemotePathMapping from 'typings/RemotePathMapping';

export const REMOTE_PATH_MAPPINGS_PATH = '/remotepathmapping';

export const NEW_REMOTE_PATH_MAPPING = {
  host: '',
  remotePath: '',
  localPath: '',
} as RemotePathMapping;

export function useRemotePathMappings() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<RemotePathMapping>(REMOTE_PATH_MAPPINGS_PATH);

  const items = useMemo(() => [...data].sort((a, b) => a.id - b.id), [data]);

  return { items, isFetching, isPopulated: isSuccess, error };
}
