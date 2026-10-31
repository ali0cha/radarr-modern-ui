import { useCallback, useMemo, useState } from 'react';
import { create, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface PendingFieldsStore {
  pendingFields: Map<string, unknown>;
}

// The values of the fields of a provider, by name, that were changed and not
// saved yet. Like the other pending stores, it belongs to the component.
export const usePendingFieldsStore = () => {
  // eslint-disable-next-line react/hook-use-state
  const [store] = useState(() => {
    return create<PendingFieldsStore>()(() => {
      return {
        pendingFields: new Map(),
      };
    });
  });

  const setPendingFields = useCallback(
    (fieldProperties: Record<string, unknown>) => {
      store.setState((state) => {
        const newPendingFields = new Map(state.pendingFields);

        Object.entries(fieldProperties).forEach(([key, value]) => {
          newPendingFields.set(key, value);
        });

        return {
          ...state,
          pendingFields: newPendingFields,
        };
      });
    },
    [store]
  );

  const clearPendingFields = useCallback(() => {
    store.setState((state) => ({
      ...state,
      pendingFields: new Map(),
    }));
  }, [store]);

  const pendingFields = useStore(
    store,
    useShallow((state) => state.pendingFields)
  );

  const hasPendingFields = useMemo(() => {
    return pendingFields.size > 0;
  }, [pendingFields]);

  return {
    store,
    pendingFields,
    setPendingFields,
    clearPendingFields,
    hasPendingFields,
  };
};
