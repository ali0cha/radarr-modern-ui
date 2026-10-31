import { useCallback, useMemo } from 'react';
import ModelBase from 'App/ModelBase';
import { usePendingChangesStore } from 'Helpers/Hooks/usePendingChangesStore';
import {
  useProviderWithDefault,
  useSaveProviderSettings,
} from 'Settings/useProviderSettings';
import selectSettings from 'Store/Selectors/selectSettings';

// An item of a settings list that is not a provider (no fields, nothing to
// test): the item being edited, the changes made to it and not saved yet, and
// its save. A new item starts from the default one, which is sent as it is.
export function useManageItem<T extends ModelBase>(
  path: string,
  id: number | undefined,
  defaultItem: T,
  onSaved: () => void
) {
  const savedItem = useProviderWithDefault<T>(id, defaultItem, path);

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
    save({ data: { ...savedItem, ...changedValues } });
  }, [save, savedItem, changedValues]);

  return {
    ...settings,
    item,
    updateValue,
    clearPendingChanges,
    saveItem,
    isSaving,
    saveError,
  };
}
