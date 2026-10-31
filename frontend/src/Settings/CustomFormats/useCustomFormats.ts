import { useCallback, useMemo, useState } from 'react';
import { usePendingChangesStore } from 'Helpers/Hooks/usePendingChangesStore';
import { usePendingFieldsStore } from 'Helpers/Hooks/usePendingFieldsStore';
import {
  useProviderSettings,
  useProviderWithDefault,
  useSaveProviderSettings,
} from 'Settings/useProviderSettings';
import selectSettings from 'Store/Selectors/selectSettings';
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

// The condition to edit when one is added: the implementation, or one of its
// presets.
export function getNewSpecification(
  implementation: CustomFormatSpecification & {
    presets?: CustomFormatSpecification[];
  },
  presetName?: string
): CustomFormatSpecification {
  const { presets, ...schema } = implementation;

  return presetName
    ? presets?.find((preset) => preset.name === presetName) ?? schema
    : schema;
}

// The conditions are not saved one by one: they are kept by the custom format
// being edited until it is saved, with ids of their own to tell them apart.
export function getNextSpecificationId(
  specifications: CustomFormatSpecification[]
) {
  return specifications.reduce((id, x) => Math.max(id, x.id), 1) + 1;
}

function withIds(specifications: CustomFormatSpecification[] = []) {
  return specifications.map((specification, index) => ({
    ...specification,
    id: specification.id || index + 1,
  }));
}

export function useManageCustomFormat(
  id: number | undefined,
  defaultCustomFormat: CustomFormat,
  onSaved: () => void
) {
  const customFormat = useProviderWithDefault<CustomFormat>(
    id,
    defaultCustomFormat,
    CUSTOM_FORMATS_PATH
  );

  const [specifications, setSpecifications] = useState(() =>
    withIds(customFormat.specifications)
  );

  const { pendingChanges, setPendingChange, clearPendingChanges } =
    usePendingChangesStore<CustomFormat>({});

  const { save, isSaving, saveError } = useSaveProviderSettings<CustomFormat>(
    id,
    CUSTOM_FORMATS_PATH,
    onSaved
  );

  const changedValues = useMemo(() => {
    const changed: Partial<CustomFormat> = {};

    (Object.keys(pendingChanges) as (keyof CustomFormat)[]).forEach((key) => {
      if (customFormat[key] !== pendingChanges[key]) {
        // @ts-expect-error - The key and the value go together
        changed[key] = pendingChanges[key];
      }
    });

    return changed;
  }, [customFormat, pendingChanges]);

  const { settings: item, ...settings } = useMemo(
    () => selectSettings<CustomFormat>(customFormat, changedValues, saveError),
    [customFormat, changedValues, saveError]
  );

  const updateValue = useCallback(
    <K extends keyof CustomFormat>(key: K, value: CustomFormat[K]) => {
      setPendingChange(key, value);
    },
    [setPendingChange]
  );

  const saveCustomFormat = useCallback(() => {
    save({
      data: { ...customFormat, ...changedValues, specifications },
    });
  }, [save, customFormat, changedValues, specifications]);

  const saveSpecification = useCallback(
    (specification: CustomFormatSpecification) => {
      setSpecifications((current) => {
        if (
          specification.id &&
          current.some((s) => s.id === specification.id)
        ) {
          return current.map((s) =>
            s.id === specification.id ? specification : s
          );
        }

        return [
          ...current,
          { ...specification, id: getNextSpecificationId(current) },
        ];
      });
    },
    []
  );

  const cloneSpecification = useCallback((specificationId: number) => {
    setSpecifications((current) => {
      const specification = current.find((s) => s.id === specificationId);

      if (!specification) {
        return current;
      }

      return [
        ...current,
        {
          ...specification,
          id: getNextSpecificationId(current),
          name: translate('DefaultNameCopiedSpecification', {
            name: specification.name,
          }),
        },
      ];
    });
  }, []);

  const deleteSpecification = useCallback((specificationId: number) => {
    setSpecifications((current) =>
      current.filter((s) => s.id !== specificationId)
    );
  }, []);

  // Replaces what is being edited by the imported custom format
  const importCustomFormat = useCallback(
    (
      values: Record<string, unknown>,
      importedSpecifications: CustomFormatSpecification[]
    ) => {
      clearPendingChanges();

      Object.entries(values).forEach(([key, value]) => {
        setPendingChange(key as keyof CustomFormat, value as never);
      });

      setSpecifications(withIds(importedSpecifications));
    },
    [clearPendingChanges, setPendingChange]
  );

  return {
    ...settings,
    item,
    specifications,
    updateValue,
    saveCustomFormat,
    isSaving,
    saveError,
    saveSpecification,
    cloneSpecification,
    deleteSpecification,
    importCustomFormat,
  };
}

// A condition being edited. Its changes are kept until they are applied to the
// custom format, nothing is sent to the server.
export function useEditSpecification(specification: CustomFormatSpecification) {
  const { pendingChanges, setPendingChange } =
    usePendingChangesStore<CustomFormatSpecification>({});

  const { pendingFields, setPendingFields } = usePendingFieldsStore();

  const { settings: item } = useMemo(() => {
    const changedFields = Object.fromEntries(pendingFields);

    return selectSettings<CustomFormatSpecification>(
      specification,
      pendingFields.size > 0
        ? { ...pendingChanges, fields: changedFields }
        : pendingChanges
    );
  }, [specification, pendingChanges, pendingFields]);

  const updateValue = useCallback(
    <K extends keyof CustomFormatSpecification>(
      key: K,
      value: CustomFormatSpecification[K]
    ) => {
      setPendingChange(key, value);
    },
    [setPendingChange]
  );

  const updateFieldValue = useCallback(
    (fieldProperties: Record<string, unknown>) => {
      setPendingFields(fieldProperties);
    },
    [setPendingFields]
  );

  // The condition with the changes applied
  const getSpecification = useCallback(() => {
    return {
      ...specification,
      ...pendingChanges,
      fields: specification.fields?.map((field) => ({
        ...field,
        value: pendingFields.has(field.name)
          ? pendingFields.get(field.name)
          : field.value,
      })),
    } as CustomFormatSpecification;
  }, [specification, pendingChanges, pendingFields]);

  return { item, updateValue, updateFieldValue, getSpecification };
}
