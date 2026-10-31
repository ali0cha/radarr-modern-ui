import { useMemo } from 'react';
import { useProviderSettings } from 'Settings/useProviderSettings';
import Indexer from 'typings/Indexer';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';

export const INDEXERS_PATH = '/indexer';

export function useIndexers() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<Indexer>(INDEXERS_PATH);

  const items = useMemo(() => [...data].sort(sortByProp('name')), [data]);

  return { items, isFetching, isPopulated: isSuccess, error };
}

// The provider to edit when a new indexer is added: the implementation, or one
// of its presets, with what it supports turned on.
export function getNewIndexer(
  implementation: Indexer & { presets?: Indexer[] },
  presetName?: string
): Indexer {
  const { presets, ...schema } = implementation;
  const selected = presetName
    ? presets?.find((preset) => preset.name === presetName) ?? schema
    : schema;

  return {
    ...selected,
    name: presetName ?? implementation.implementationName,
    implementationName: implementation.implementationName,
    enableRss: selected.supportsRss,
    enableAutomaticSearch: selected.supportsSearch,
    enableInteractiveSearch: selected.supportsSearch,
  };
}

// The provider to edit when an indexer is cloned. The secrets are not copied.
export function getClonedIndexer(indexer: Indexer): Indexer {
  const { id: _id, ...cloned } = indexer;

  return {
    ...cloned,
    name: translate('DefaultNameCopiedProfile', { name: indexer.name }),
    fields: indexer.fields.map((field) => {
      return field.privacy === 'apiKey' || field.privacy === 'password'
        ? { ...field, value: '' }
        : { ...field };
    }),
  } as Indexer;
}
