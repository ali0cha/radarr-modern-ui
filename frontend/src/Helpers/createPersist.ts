import { create, type StateCreator } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';

const LEGACY_KEY = 'radarr';

function getInstanceName() {
  return window.Radarr.instanceName.toLowerCase().replace(/ /g, '_');
}

// The preferences used to be saved by redux-localstorage as one JSON document,
// with the same shape as the Redux state: { settings: { ... }, history: { ... } }.
function readLegacyState(): Record<string, unknown> | undefined {
  const instanceKey = getInstanceName() || LEGACY_KEY;
  const json =
    localStorage.getItem(instanceKey) ?? localStorage.getItem(LEGACY_KEY);

  return json ? (JSON.parse(json) as Record<string, unknown>) : undefined;
}

interface CreatePersistOptions<T>
  extends Omit<PersistOptions<T>, 'name' | 'storage'> {
  // Picks the values of this store from the document that redux-localstorage
  // saved. It is only used when the store has not been saved yet, so that
  // existing preferences are not lost.
  migrateFromLegacy?: (
    legacyState: Record<string, unknown>
  ) => Partial<T> | undefined;
}

export const createPersist = <T>(
  name: string,
  state: StateCreator<T>,
  { migrateFromLegacy, ...options }: CreatePersistOptions<T> = {}
) => {
  const finalName = `${getInstanceName() || LEGACY_KEY}_${name}`;

  if (migrateFromLegacy) {
    try {
      if (localStorage.getItem(finalName) === null) {
        const legacyState = readLegacyState();
        const migrated = legacyState
          ? migrateFromLegacy(legacyState)
          : undefined;

        if (migrated !== undefined) {
          localStorage.setItem(
            finalName,
            JSON.stringify({ state: migrated, version: options.version ?? 0 })
          );
        }
      }
    } catch {
      // Storage may be unavailable or the document may be invalid, the
      // preferences then start from their defaults.
    }
  }

  return create(
    persist<T>(state, {
      ...options,
      name: finalName,
    })
  );
};
