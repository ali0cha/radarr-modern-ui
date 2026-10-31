import { useMemo } from 'react';
import DownloadProtocol from 'DownloadClient/DownloadProtocol';
import { useProviderSettings } from 'Settings/useProviderSettings';
import DownloadClient from 'typings/DownloadClient';
import sortByProp from 'Utilities/Array/sortByProp';

export const DOWNLOAD_CLIENTS_PATH = '/downloadclient';

export function useDownloadClients() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<DownloadClient>(DOWNLOAD_CLIENTS_PATH);

  const items = useMemo(() => [...data].sort(sortByProp('name')), [data]);

  return { items, isFetching, isPopulated: isSuccess, error };
}

export function useEnabledDownloadClients(protocol: DownloadProtocol) {
  const { items, ...result } = useDownloadClients();

  return {
    ...result,
    items: useMemo(
      () => items.filter((item) => item.protocol === protocol && item.enable),
      [items, protocol]
    ),
  };
}

// The hosts of the download clients, with the names of the clients that use
// them: the choices of the remote path mappings.
export function useDownloadClientHosts() {
  const { items } = useDownloadClients();

  return useMemo(() => {
    const hosts = items.reduce<Record<string, string[]>>(
      (acc, downloadClient) => {
        const host = downloadClient.fields.find(
          (field) => field.name === 'host'
        );

        if (host) {
          const group = (acc[host.value as string] ??= []);
          group.push(downloadClient.name);
        }

        return acc;
      },
      {}
    );

    return Object.keys(hosts).map((host) => ({
      key: host,
      value: host,
      hint: hosts[host].join(', '),
    }));
  }, [items]);
}

// The provider to edit when a new download client is added: the
// implementation, or one of its presets, enabled.
export function getNewDownloadClient(
  implementation: DownloadClient & { presets?: DownloadClient[] },
  presetName?: string
): DownloadClient {
  const { presets, ...schema } = implementation;
  const selected = presetName
    ? presets?.find((preset) => preset.name === presetName) ?? schema
    : schema;

  return {
    ...selected,
    name: presetName ?? implementation.implementationName,
    implementationName: implementation.implementationName,
    enable: true,
  };
}
