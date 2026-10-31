import React, { useCallback, useMemo } from 'react';
import useShowAdvancedSettings from 'Helpers/Hooks/useShowAdvancedSettings';
import { useLanguages } from 'Language/useLanguages';
import { useManageSettings } from 'Settings/useSettings';
import UISettings from './UISettings';
import { UI_SETTINGS_PATH } from './useUISettings';

const FILTER_LANGUAGES = ['Any', 'Unknown', 'Original'];

function UISettingsConnector() {
  const advancedSettings = useShowAdvancedSettings();

  const {
    items: languageItems,
    isFetching: isFetchingLanguages,
    isPopulated: isLanguagesPopulated,
    error: languagesError
  } = useLanguages(FILTER_LANGUAGES);

  const {
    updateSetting,
    saveSettings,
    isFetching,
    error,
    ...sectionSettings
  } = useManageSettings(UI_SETTINGS_PATH);

  const languages = useMemo(() => {
    return languageItems.map((item) => {
      return {
        key: item.id,
        value: item.name
      };
    });
  }, [languageItems]);

  const onInputChange = useCallback(({ name, value }) => {
    updateSetting(name, value);
  }, [updateSetting]);

  return (
    <UISettings
      {...sectionSettings}
      advancedSettings={advancedSettings}
      languages={languages}
      isLanguagesPopulated={isLanguagesPopulated}
      isFetching={isFetching || isFetchingLanguages}
      error={error || languagesError}
      onInputChange={onInputChange}
      onSavePress={saveSettings}
    />
  );
}

export default UISettingsConnector;
