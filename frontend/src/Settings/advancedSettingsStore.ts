import { createPersist } from 'Helpers/createPersist';

interface AdvancedSettingsState {
  showAdvancedSettings: boolean;
}

const advancedSettingsStore = createPersist<AdvancedSettingsState>(
  'advanced_settings',
  () => ({ showAdvancedSettings: false }),
  {
    migrateFromLegacy: (legacyState) => {
      const settings = legacyState.settings as
        | { advancedSettings?: unknown }
        | undefined;

      return typeof settings?.advancedSettings === 'boolean'
        ? { showAdvancedSettings: settings.advancedSettings }
        : undefined;
    },
  }
);

export const useShowAdvancedSettings = () => {
  return advancedSettingsStore((state) => state.showAdvancedSettings);
};

export const toggleShowAdvancedSettings = () => {
  advancedSettingsStore.setState((state) => ({
    showAdvancedSettings: !state.showAdvancedSettings,
  }));
};

// For code outside of React.
export const getShowAdvancedSettings = () =>
  advancedSettingsStore.getState().showAdvancedSettings;

export const subscribeToShowAdvancedSettings = (
  listener: (showAdvancedSettings: boolean) => void
) =>
  advancedSettingsStore.subscribe((state, previousState) => {
    if (state.showAdvancedSettings !== previousState.showAdvancedSettings) {
      listener(state.showAdvancedSettings);
    }
  });
