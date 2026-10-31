import { useMemo } from 'react';
import { useProviderSettings } from 'Settings/useProviderSettings';
import MetadataModel from 'typings/Metadata';
import sortByProp from 'Utilities/Array/sortByProp';

export const METADATA_PATH = '/metadata';

export function useMetadata() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<MetadataModel>(METADATA_PATH);

  const items = useMemo(() => [...data].sort(sortByProp('name')), [data]);

  return { items, isFetching, isPopulated: isSuccess, error };
}
