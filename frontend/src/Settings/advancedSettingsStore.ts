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
