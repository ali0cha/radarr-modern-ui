import { useMemo } from 'react';
import {
  useProviderSchema,
  useProviderSettings,
} from 'Settings/useProviderSettings';
import ImportList from 'typings/ImportList';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';

export const IMPORT_LISTS_PATH = '/importlist';

const TMDB_PERSON_IMPLEMENTATION = 'TMDbPersonImport';

export function useImportLists() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<ImportList>(IMPORT_LISTS_PATH);

  const items = useMemo(() => [...data].sort(sortByProp('name')), [data]);

  return { items, isFetching, isPopulated: isSuccess, error };
}

// The provider to edit when a new import list is added: the implementation,
// or one of its presets.
export function getNewImportList(
  implementation: ImportList & { presets?: ImportList[] },
  presetName?: string
): ImportList {
  const { presets, ...schema } = implementation;
  const selected = presetName
    ? presets?.find((preset) => preset.name === presetName) ?? schema
    : schema;

  return {
    ...selected,
    name: presetName ?? implementation.implementationName,
    implementationName: implementation.implementationName,
    minRefreshInterval:
      selected.minRefreshInterval ?? implementation.minRefreshInterval,
    minimumAvailability: 'released',
    rootFolderPath: '',
  };
}

// The provider to edit when an import list is cloned. The secrets are not
// copied.
export function getClonedImportList(importList: ImportList): ImportList {
  const { id: _id, ...cloned } = importList;

  return {
    ...cloned,
    name: translate('DefaultNameCopiedImportList', { name: importList.name }),
    fields: importList.fields.map((field) => {
      return field.privacy === 'apiKey' || field.privacy === 'password'
        ? { ...field, value: '' }
        : { ...field };
    }),
  } as ImportList;
}

// The import list that follows a person, if there is one.
export function usePersonImportList(tmdbId: number) {
  const { items } = useImportLists();

  return useMemo(
    () =>
      items.find((importList) => {
        if (importList.implementation !== TMDB_PERSON_IMPLEMENTATION) {
          return false;
        }

        const personId = importList.fields.find(
          (field) => field.name === 'personId'
        )?.value as string | null;

        return !!personId && parseInt(personId) === tmdbId;
      }),
    [items, tmdbId]
  );
}

// The import list to edit when a person is followed.
export function useNewPersonImportList(tmdbId: number, personName: string) {
  const { data: schema } = useProviderSchema<ImportList>(IMPORT_LISTS_PATH);

  return useMemo(() => {
    const implementation = schema.find(
      (item) => item.implementation === TMDB_PERSON_IMPLEMENTATION
    );

    if (!implementation) {
      return undefined;
    }

    const newImportList = getNewImportList(implementation);

    return {
      ...newImportList,
      name: `${personName} - ${tmdbId}`,
      fields: newImportList.fields.map((field) =>
        field.name === 'personId'
          ? { ...field, value: tmdbId.toString() }
          : field
      ),
    };
  }, [schema, tmdbId, personName]);
}
