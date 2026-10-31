import { useCallback, useMemo, useState } from 'react';
import ModelBase from 'App/ModelBase';
import { usePendingChangesStore } from 'Helpers/Hooks/usePendingChangesStore';
import { usePendingFieldsStore } from 'Helpers/Hooks/usePendingFieldsStore';
import {
  useProviderWithDefault,
  useSaveProviderSettings,
} from 'Settings/useProviderSettings';
import selectSettings from 'Store/Selectors/selectSettings';
import Field from 'typings/Field';
import translate from 'Utilities/String/translate';

// A condition of a custom format or of an auto tag. The conditions are not
// saved one by one: they are kept by the item being edited until it is saved,
// with ids of their own to tell them apart.
export interface SpecificationBase extends ModelBase {
  name: string;
  fields: Field[];
}

// The condition to edit when one is added: the implementation, or one of its
// presets.
export function getNewSpecification<T extends SpecificationBase>(
  implementation: T & { presets?: T[] },
  presetName?: string
): T {
  const { presets, ...schema } = implementation;

  return presetName
    ? presets?.find((preset) => preset.name === presetName) ?? (schema as T)
    : (schema as T);
}

export function getNextSpecificationId(specifications: SpecificationBase[]) {
  return specifications.reduce((id, x) => Math.max(id, x.id), 1) + 1;
}

function withIds<T extends SpecificationBase>(specifications: T[] = []) {
  return specifications.map((specification, index) => ({
    ...specification,
    id: specification.id || index + 1,
  }));
}

// An item that has conditions (custom format, auto tag): the changes made to
// it, its conditions, and the save of both.
export function useManageWithSpecifications<
  T extends ModelBase & { specifications?: S[] },
  S extends SpecificationBase
>(path: string, id: number | undefined, defaultItem: T, onSaved: () => void) {
  const savedItem = useProviderWithDefault<T>(id, defaultItem, path);

  const [specifications, setSpecifications] = useState(() =>
    withIds(savedItem.specifications)
  );

  const { pendingChanges, setPendingChange, clearPendingChanges } =
    usePendingChangesStore<T>({});

  const { save, isSaving, saveError } = useSaveProviderSettings<T>(
    id,
    path,
    onSaved
  );

  const changedValues = useMemo(() => {
    const changed: Partial<T> = {};

    (Object.keys(pendingChanges) as (keyof T)[]).forEach((key) => {
      if (savedItem[key] !== pendingChanges[key]) {
        changed[key] = pendingChanges[key];
      }
    });

    return changed;
  }, [savedItem, pendingChanges]);

  const { settings: item, ...settings } = useMemo(
    () => selectSettings<T>(savedItem, changedValues, saveError),
    [savedItem, changedValues, saveError]
  );

  const updateValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setPendingChange(key, value);
    },
    [setPendingChange]
  );

  const saveItem = useCallback(() => {
    save({ data: { ...savedItem, ...changedValues, specifications } });
  }, [save, savedItem, changedValues, specifications]);

  const saveSpecification = useCallback((specification: S) => {
    setSpecifications((current) => {
      if (specification.id && current.some((s) => s.id === specification.id)) {
        return current.map((s) =>
          s.id === specification.id ? specification : s
        );
      }

      return [
        ...current,
        { ...specification, id: getNextSpecificationId(current) },
      ];
    });
  }, []);

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

  // Replaces what is being edited, e.g. by an imported custom format
  const replaceItem = useCallback(
    (values: Record<string, unknown>, newSpecifications: S[]) => {
      clearPendingChanges();

      Object.entries(values).forEach(([key, value]) => {
        setPendingChange(key as keyof T, value as T[keyof T]);
      });

      setSpecifications(withIds(newSpecifications));
    },
    [clearPendingChanges, setPendingChange]
  );

  return {
    ...settings,
    item,
    specifications,
    updateValue,
    saveItem,
    isSaving,
    saveError,
    saveSpecification,
    cloneSpecification,
    deleteSpecification,
    replaceItem,
  };
}

// A condition being edited. Its changes are kept until they are applied to the
// item that has it, nothing is sent to the server.
export function useEditSpecification<T extends SpecificationBase>(
  specification: T
) {
  const { pendingChanges, setPendingChange } = usePendingChangesStore<T>({});

  const { pendingFields, setPendingFields } = usePendingFieldsStore();

  const { settings: item } = useMemo(() => {
    const changedFields = Object.fromEntries(pendingFields);

    return selectSettings<T>(
      specification,
      pendingFields.size > 0
        ? { ...pendingChanges, fields: changedFields }
        : pendingChanges
    );
  }, [specification, pendingChanges, pendingFields]);

  const updateValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
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
    } as T;
  }, [specification, pendingChanges, pendingFields]);

  return { item, updateValue, updateFieldValue, getSpecification };
}
