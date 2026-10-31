import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery, { getApiQueryKey } from 'Helpers/Hooks/useApiQuery';
import { usePendingChangesStore } from 'Helpers/Hooks/usePendingChangesStore';
import selectSettings from 'Store/Selectors/selectSettings';

const NO_SETTINGS = {};

// Settings are fetched every time the page that shows them is opened, but not
// because the window got the focus or the connection came back.
const settingsQueryOptions = {
  retry: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

export const useSettings = <T extends object>(path: string) => {
  const result = useApiQuery<T>({
    path,
    queryOptions: settingsQueryOptions,
  });

  return {
    ...result,
    data: result.data ?? (NO_SETTINGS as T),
  };
};

export const useSaveSettings = <T extends object>(
  path: string,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<T, T>({
    path,
    method: 'PUT',
    mutationOptions: {
      onSuccess: (updatedSettings) => {
        queryClient.setQueriesData<T>(
          { queryKey: getApiQueryKey(path) },
          updatedSettings
        );

        onSuccess?.();
      },
    },
  });

  return {
    save: mutate,
    isSaving: isPending,
    saveError: error,
  };
};

// The settings of one section: what the server has, the changes that were made
// and not saved yet, and the validation failures of the last save.
export const useManageSettings = <T extends object>(path: string) => {
  const { data, isFetching, isSuccess, error } = useSettings<T>(path);

  const { pendingChanges, setPendingChange, clearPendingChanges } =
    usePendingChangesStore<T>({});

  const { save, isSaving, saveError } = useSaveSettings<T>(
    path,
    clearPendingChanges
  );

  // A value that was changed back is not a pending change anymore
  const changedValues = useMemo(() => {
    const changed: Partial<T> = {};

    (Object.keys(pendingChanges) as (keyof T)[]).forEach((key) => {
      if (data[key] !== pendingChanges[key]) {
        changed[key] = pendingChanges[key];
      }
    });

    return changed;
  }, [data, pendingChanges]);

  const settings = useMemo(() => {
    return selectSettings<T>(data, changedValues, saveError);
  }, [data, changedValues, saveError]);

  const saveSettings = useCallback(() => {
    save({ ...data, ...changedValues });
  }, [data, changedValues, save]);

  const updateSetting = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setPendingChange(key, value);
    },
    [setPendingChange]
  );

  return {
    ...settings,
    updateSetting,
    saveSettings,
    isFetching,
    isPopulated: isSuccess,
    isSaving,
    error,
    saveError,
  };
};
