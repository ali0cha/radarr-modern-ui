import React, { useCallback, useEffect } from 'react';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import useShowAdvancedSettings from 'Helpers/Hooks/useShowAdvancedSettings';
import { inputTypes, kinds } from 'Helpers/Props';
import { useManageSettings } from 'Settings/useSettings';
import ImportListOptionsSettings from 'typings/ImportListOptionsSettings';
import { InputChanged } from 'typings/inputs';
import {
  OnChildStateChange,
  SetChildSave,
} from 'typings/Settings/SettingsState';
import translate from 'Utilities/String/translate';

const PATH = '/config/importlist';

const cleanLibraryLevelOptions: EnhancedSelectInputValue<string>[] = [
  {
    key: 'disabled',
    get value() {
      return translate('Disabled');
    },
  },
  {
    key: 'logOnly',
    get value() {
      return translate('LogOnly');
    },
  },
  {
    key: 'keepAndUnmonitor',
    get value() {
      return translate('KeepAndUnmonitorMovie');
    },
  },
  {
    key: 'removeAndKeep',
    get value() {
      return translate('RemoveMovieAndKeepFiles');
    },
  },
  {
    key: 'removeAndDelete',
    get value() {
      return translate('RemoveMovieAndDeleteFiles');
    },
  },
];

interface ImportListOptionsProps {
  setChildSave: SetChildSave;
  onChildStateChange: OnChildStateChange;
}

function ImportListOptions({
  setChildSave,
  onChildStateChange,
}: ImportListOptionsProps) {
  const showAdvancedSettings = useShowAdvancedSettings();

  const {
    isFetching,
    isSaving,
    hasPendingChanges,
    error,
    settings,
    hasSettings,
    updateSetting,
    saveSettings,
  } = useManageSettings<ImportListOptionsSettings>(PATH);

  const { listSyncLevel } = settings;

  const onInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateSetting(
        name as keyof ImportListOptionsSettings,
        value as ImportListOptionsSettings[keyof ImportListOptionsSettings]
      );
    },
    [updateSetting]
  );

  useEffect(() => {
    setChildSave(saveSettings);
  }, [saveSettings, setChildSave]);

  useEffect(() => {
    onChildStateChange({
      isSaving,
      hasPendingChanges,
    });
  }, [onChildStateChange, isSaving, hasPendingChanges]);

  if (!showAdvancedSettings) {
    return null;
  }

  return (
    <FieldSet legend={translate('Options')}>
      {isFetching ? <LoadingIndicator /> : null}

      {!isFetching && error ? (
        <Alert kind={kinds.DANGER}>{translate('ListOptionsLoadError')}</Alert>
      ) : null}

      {hasSettings && !isFetching && !error ? (
        <Form>
          <FormGroup advancedSettings={showAdvancedSettings} isAdvanced={true}>
            <FormLabel>{translate('CleanLibraryLevel')}</FormLabel>
            <FormInputGroup
              type={inputTypes.SELECT}
              name="listSyncLevel"
              values={cleanLibraryLevelOptions}
              helpText={translate('ListSyncLevelHelpText')}
              onChange={onInputChange}
              {...listSyncLevel}
            />
          </FormGroup>
        </Form>
      ) : null}
    </FieldSet>
  );
}

export default ImportListOptions;
