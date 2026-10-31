import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';
import ModelBase from 'App/ModelBase';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery, {
  ApiError,
  fetchApi,
  getApiPath,
  getApiQueryKey,
} from 'Helpers/Hooks/useApiQuery';
import { usePendingChangesStore } from 'Helpers/Hooks/usePendingChangesStore';
import { usePendingFieldsStore } from 'Helpers/Hooks/usePendingFieldsStore';
import selectSettings from 'Store/Selectors/selectSettings';
import Provider from 'typings/Provider';

// Providers are fetched every time a screen needs them, but not because the
// window got the focus or the connection came back.
const providerQueryOptions = {
  retry: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

const NO_PROVIDERS: never[] = [];

function addOrUpdateItem<T extends ModelBase>(items: T[], item: T) {
  const exists = items.some(({ id }) => id === item.id);

  return exists
    ? items.map((existing) => (existing.id === item.id ? item : existing))
    : [...items, item];
}

export const useProviderSettings = <T extends ModelBase>(path: string) => {
  const result = useApiQuery<T[]>({
    path,
    queryOptions: providerQueryOptions,
  });

  return {
    ...result,
    data: result.data ?? (NO_PROVIDERS as T[]),
  };
};

// The kinds of provider that can be added, with their presets.
export const useProviderSchema = <T extends Provider>(path: string) => {
  const result = useApiQuery<T[]>({
    path: `${path}/schema`,
    queryOptions: providerQueryOptions,
  });

  return {
    ...result,
    data: result.data ?? (NO_PROVIDERS as T[]),
  };
};

// The provider that is edited: the existing one, or the default of a new one.
export const useProviderWithDefault = <T extends ModelBase>(
  id: number | undefined,
  defaultProvider: T,
  path: string
) => {
  const { data } = useProviderSettings<T>(path);

  return useMemo(() => {
    if (!id) {
      return defaultProvider;
    }

    return data.find((provider) => provider.id === id) ?? defaultProvider;
  }, [data, defaultProvider, id]);
};

interface SaveRequest<T> {
  data: T;
  forceSave?: boolean;
}

export const useSaveProviderSettings = <T extends ModelBase>(
  id: number | undefined,
  path: string,
  onSuccess?: (updatedProvider: T) => void
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, submittedAt } = useMutation<
    T,
    ApiError,
    SaveRequest<T>
  >({
    mutationFn: ({ data, forceSave }) => {
      const requestPath = id ? `${path}/${id}` : path;

      return fetchApi<T>(
        getApiPath(requestPath) + (forceSave ? '?forceSave=true' : ''),
        {
          method: id ? 'PUT' : 'POST',
          headers: {
            'X-Api-Key': window.Radarr.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
    },
    onSuccess: (updatedProvider) => {
      queryClient.setQueriesData<T[]>(
        { queryKey: getApiQueryKey(path) },
        (providers) =>
          providers ? addOrUpdateItem(providers, updatedProvider) : providers
      );

      onSuccess?.(updatedProvider);
    },
  });

  return {
    save: mutate,
    isSaving: isPending,
    saveError: error,
    saveSubmittedAt: submittedAt,
  };
};

interface TestRequest<T> {
  data: T;
  forceTest?: boolean;
}

export const useTestProvider = <T extends ModelBase>(path: string) => {
  const { mutate, isPending, error, submittedAt } = useMutation<
    unknown,
    ApiError,
    TestRequest<T>
  >({
    mutationFn: ({ data, forceTest }) => {
      return fetchApi<unknown>(
        `${getApiPath(`${path}/test`)}${forceTest ? '?forceTest=true' : ''}`,
        {
          method: 'POST',
          headers: {
            'X-Api-Key': window.Radarr.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
    },
  });

  return {
    test: mutate,
    isTesting: isPending,
    testError: error,
    testSubmittedAt: submittedAt,
  };
};

export const useTestAllProviders = (path: string) => {
  const { mutate, isPending, error } = useApiMutation<unknown>({
    path: `${path}/testall`,
    method: 'POST',
    sendBody: false,
  });

  return {
    testAll: () => mutate(),
    isTestingAll: isPending,
    testAllError: error,
  };
};

export const useDeleteProvider = <T extends ModelBase>(
  id: number,
  path: string
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<unknown, void>({
    path: `${path}/${id}`,
    method: 'DELETE',
    mutationOptions: {
      onSuccess: () => {
        queryClient.setQueriesData<T[]>(
          { queryKey: getApiQueryKey(path) },
          (providers) => providers?.filter((provider) => provider.id !== id)
        );
      },
    },
  });

  return {
    deleteProvider: () => mutate(),
    isDeleting: isPending,
    deleteError: error,
  };
};

// Changes the same properties of several providers at once. The server answers
// with the providers it updated.
export const useBulkEditProviders = <T extends ModelBase, V extends object>(
  path: string
) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<T[], V>({
    path: `${path}/bulk`,
    method: 'PUT',
    mutationOptions: {
      onSuccess: (updatedProviders) => {
        queryClient.setQueriesData<T[]>(
          { queryKey: getApiQueryKey(path) },
          (providers) =>
            providers
              ? updatedProviders.reduce(addOrUpdateItem, providers)
              : providers
        );
      },
    },
  });

  return {
    bulkEdit: mutate,
    isBulkEditing: isPending,
    bulkEditError: error,
  };
};

export const useBulkDeleteProviders = <T extends ModelBase>(path: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useApiMutation<
    unknown,
    { ids: number[] }
  >({
    path: `${path}/bulk`,
    method: 'DELETE',
    sendBody: true,
    mutationOptions: {
      onSuccess: (_data, { ids }) => {
        queryClient.setQueriesData<T[]>(
          { queryKey: getApiQueryKey(path) },
          (providers) =>
            providers?.filter((provider) => !ids.includes(provider.id))
        );
      },
    },
  });

  return {
    bulkDelete: mutate,
    isBulkDeleting: isPending,
    bulkDeleteError: error,
  };
};

// The provider being edited, the changes made to it and not saved yet (values
// and field values are kept apart), and the save and the test of it.
export const useManageProviderSettings = <T extends Provider>(
  id: number | undefined,
  defaultProvider: T,
  path: string
) => {
  const provider = useProviderWithDefault<T>(id, defaultProvider, path);

  // The same data sent twice is sent again without testing it first
  const lastSaveData = useRef<string | null>(null);
  const lastTestData = useRef<string | null>(null);

  const { pendingChanges, setPendingChange, clearPendingChanges } =
    usePendingChangesStore<T>({});

  const { pendingFields, setPendingFields, clearPendingFields } =
    usePendingFieldsStore();

  const handleSaveSuccess = useCallback(() => {
    clearPendingChanges();
    clearPendingFields();
    lastSaveData.current = null;
  }, [clearPendingChanges, clearPendingFields]);

  const { save, isSaving, saveError, saveSubmittedAt } =
    useSaveProviderSettings<T>(id, path, handleSaveSuccess);

  const { test, isTesting, testError, testSubmittedAt } =
    useTestProvider<T>(path);

  // The failures shown are those of the last thing that was submitted
  const mutationError =
    saveSubmittedAt >= testSubmittedAt ? saveError : testError;

  const changedValues = useMemo(() => {
    const changed: Partial<T> = {};

    (Object.keys(pendingChanges) as (keyof T)[]).forEach((key) => {
      if (provider[key] !== pendingChanges[key]) {
        changed[key] = pendingChanges[key];
      }
    });

    return changed;
  }, [provider, pendingChanges]);

  const changedFields = useMemo(() => {
    const changed = new Map<string, unknown>();

    pendingFields.forEach((value, name) => {
      if (provider.fields?.find((f) => f.name === name)?.value !== value) {
        changed.set(name, value);
      }
    });

    return changed;
  }, [provider, pendingFields]);

  const { settings: item, ...settings } = useMemo(() => {
    const combinedPendingChanges =
      changedFields.size > 0
        ? { ...changedValues, fields: Object.fromEntries(changedFields) }
        : changedValues;

    return selectSettings<T>(provider, combinedPendingChanges, mutationError);
  }, [provider, changedValues, changedFields, mutationError]);

  // What is sent to the server: the provider with the changes applied, and only
  // the name and the value of its fields.
  const getRequestData = useCallback(() => {
    const { presets, ...rest } = {
      ...provider,
      ...changedValues,
    } as T & { presets?: unknown };

    return {
      ...rest,
      fields: provider.fields?.map(({ name, value }) => ({
        name,
        value: changedFields.has(name) ? changedFields.get(name) : value,
      })),
    } as unknown as T;
  }, [provider, changedValues, changedFields]);

  const saveProvider = useCallback(() => {
    const data = getRequestData();
    const serialized = JSON.stringify(data);

    save({ data, forceSave: lastSaveData.current === serialized });

    lastSaveData.current = serialized;
  }, [getRequestData, save]);

  const testProvider = useCallback(() => {
    const data = getRequestData();
    const serialized = JSON.stringify(data);

    test({ data, forceTest: lastTestData.current === serialized });

    lastTestData.current = serialized;
  }, [getRequestData, test]);

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

  return {
    ...settings,
    item,
    updateValue,
    updateFieldValue,
    saveProvider,
    isSaving,
    testProvider,
    isTesting,
    saveError: mutationError,
  };
};
