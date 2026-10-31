import { useMemo } from 'react';
import { useProviderSettings } from 'Settings/useProviderSettings';
import { useManageWithSpecifications } from 'Settings/useSpecifications';
import CustomFormat, { CustomFormatSpecification } from 'typings/CustomFormat';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';

export const CUSTOM_FORMATS_PATH = '/customformat';

export function useCustomFormats() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<CustomFormat>(CUSTOM_FORMATS_PATH);

  const items = useMemo(() => [...data].sort(sortByProp('name')), [data]);

  return { items, isFetching, isPopulated: isSuccess, error };
}

export const NEW_CUSTOM_FORMAT = {
  includeCustomFormatWhenRenaming: false,
  specifications: [],
} as unknown as CustomFormat;

// The custom format to edit when one is cloned, with its conditions.
export function getClonedCustomFormat(
  customFormat: CustomFormat
): CustomFormat {
  const { id: _id, ...cloned } = customFormat;

  return {
    ...cloned,
    name: translate('DefaultNameCopiedProfile', { name: customFormat.name }),
  } as CustomFormat;
}

export function useManageCustomFormat(
  id: number | undefined,
  defaultCustomFormat: CustomFormat,
  onSaved: () => void
) {
  const {
    saveItem: saveCustomFormat,
    replaceItem: importCustomFormat,
    ...result
  } = useManageWithSpecifications<CustomFormat, CustomFormatSpecification>(
    CUSTOM_FORMATS_PATH,
    id,
    defaultCustomFormat,
    onSaved
  );

  return { ...result, saveCustomFormat, importCustomFormat };
}
