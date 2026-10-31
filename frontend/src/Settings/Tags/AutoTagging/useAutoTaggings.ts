import { useMemo } from 'react';
import { useProviderSettings } from 'Settings/useProviderSettings';
import { useManageWithSpecifications } from 'Settings/useSpecifications';
import AutoTagging, { AutoTaggingSpecification } from 'typings/AutoTagging';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';

export const AUTO_TAGGINGS_PATH = '/autoTagging';

export function useAutoTaggings() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<AutoTagging>(AUTO_TAGGINGS_PATH);

  const items = useMemo(() => [...data].sort(sortByProp('name')), [data]);

  return { items, isFetching, isPopulated: isSuccess, error };
}

export const NEW_AUTO_TAGGING = {
  removeTagsAutomatically: false,
  tags: [],
  specifications: [],
} as unknown as AutoTagging;

// The auto tag to edit when one is cloned, with its conditions.
export function getClonedAutoTagging(autoTagging: AutoTagging): AutoTagging {
  const { id: _id, ...cloned } = autoTagging;

  return {
    ...cloned,
    name: translate('DefaultNameCopiedProfile', { name: autoTagging.name }),
  } as AutoTagging;
}

export function useManageAutoTagging(
  id: number | undefined,
  defaultAutoTagging: AutoTagging,
  onSaved: () => void
) {
  const {
    saveItem: saveAutoTagging,
    replaceItem: _replaceItem,
    ...result
  } = useManageWithSpecifications<AutoTagging, AutoTaggingSpecification>(
    AUTO_TAGGINGS_PATH,
    id,
    defaultAutoTagging,
    onSaved
  );

  return { ...result, saveAutoTagging };
}
