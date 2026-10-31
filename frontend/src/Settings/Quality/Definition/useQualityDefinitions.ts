import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import { getApiQueryKey } from 'Helpers/Hooks/useApiQuery';
import { useProviderSettings } from 'Settings/useProviderSettings';
import QualityDefinition from 'typings/QualityDefinition';

export const QUALITY_DEFINITIONS_PATH = '/qualitydefinition';

type PendingChanges = Record<number, Partial<QualityDefinition>>;

export function useQualityDefinitions() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<QualityDefinition>(QUALITY_DEFINITIONS_PATH);

  return { items: data, isFetching, isPopulated: isSuccess, error };
}

// The definitions, with the changes made to them and not saved yet, and the
// save of the ones that changed.
export function useManageQualityDefinitions() {
  const queryClient = useQueryClient();
  const { items, isFetching, isPopulated, error } = useQualityDefinitions();

  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});

  const {
    mutate,
    isPending,
    error: saveError,
  } = useApiMutation<QualityDefinition[], QualityDefinition[]>({
    path: `${QUALITY_DEFINITIONS_PATH}/update`,
    method: 'PUT',
    mutationOptions: {
      onSuccess: (definitions) => {
        queryClient.setQueriesData<QualityDefinition[]>(
          { queryKey: getApiQueryKey(QUALITY_DEFINITIONS_PATH) },
          definitions
        );

        setPendingChanges({});
      },
    },
  });

  const definitions = useMemo(
    () =>
      items.map((item) => ({ ...item, ...(pendingChanges[item.id] ?? {}) })),
    [items, pendingChanges]
  );

  const updateValue = useCallback(
    <K extends keyof QualityDefinition>(
      id: number,
      name: K,
      value: QualityDefinition[K]
    ) => {
      const currentValue = items.find((item) => item.id === id)?.[name];

      setPendingChanges((current) => {
        const definitionChanges = { ...(current[id] ?? {}) };

        if (currentValue === value) {
          delete definitionChanges[name];
        } else {
          definitionChanges[name] = value;
        }

        const { [id]: _removed, ...others } = current;

        return Object.keys(definitionChanges).length
          ? { ...others, [id]: definitionChanges }
          : others;
      });
    },
    [items]
  );

  const save = useCallback(() => {
    const updated = Object.keys(pendingChanges).map((key) => {
      const id = parseInt(key);

      return {
        ...items.find((item) => item.id === id),
        ...pendingChanges[id],
      } as QualityDefinition;
    });

    // If there is nothing to save don't bother
    if (updated.length) {
      mutate(updated);
    }
  }, [items, pendingChanges, mutate]);

  return {
    items: definitions,
    isFetching,
    isPopulated,
    error,
    hasPendingChanges: Object.keys(pendingChanges).length > 0,
    isSaving: isPending,
    saveError,
    updateValue,
    save,
  };
}
