import { getShowAdvancedSettings, subscribeToShowAdvancedSettings } from 'Settings/advancedSettingsStore';
import { set } from 'Store/Actions/baseActions';

// The preference lives in its own store now, but connected components that have
// not been migrated yet still read it from Redux. Mirror it until they are.
export default function syncAdvancedSettings(store) {
  const sync = (advancedSettings) => {
    store.dispatch(set({ section: 'settings', advancedSettings }));
  };

  sync(getShowAdvancedSettings());

  return subscribeToShowAdvancedSettings(sync);
}
