import React, { useCallback, useEffect } from 'react';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import { inputTypes, kinds } from 'Helpers/Props';
import { useManageSettings } from 'Settings/useSettings';
import { InputChanged } from 'typings/inputs';
import MetadataOptionsSettings from 'typings/Settings/MetadataOptions';
import {
  OnChildStateChange,
  SetChildSave,
} from 'typings/Settings/SettingsState';
import translate from 'Utilities/String/translate';

const PATH = '/config/metadata';

// Note: Do Not Translate Certification Countries

export const certificationCountryOptions = [
  { key: 'us', value: 'United States' },
  { key: 'au', value: 'Australia' },
  { key: 'br', value: 'Brazil' },
  { key: 'ca', value: 'Canada' },
  { key: 'fr', value: 'France' },
  { key: 'de', value: 'Germany' },
  { key: 'gb', value: 'Great Britain' },
  { key: 'in', value: 'India' },
  { key: 'ie', value: 'Ireland' },
  { key: 'it', value: 'Italy' },
  { key: 'nz', value: 'New Zealand' },
  { key: 'ro', value: 'Romania' },
  { key: 'es', value: 'Spain' },
];

interface MetadataOptionsProps {
  setChildSave: SetChildSave;
  onChildStateChange: OnChildStateChange;
}

function MetadataOptions({
  setChildSave,
  onChildStateChange,
}: MetadataOptionsProps) {
  const {
    isFetching,
    isSaving,
    error,
    settings,
    hasSettings,
    hasPendingChanges,
    updateSetting,
    saveSettings,
  } = useManageSettings<MetadataOptionsSettings>(PATH);

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateSetting(
        name as keyof MetadataOptionsSettings,
        value as MetadataOptionsSettings[keyof MetadataOptionsSettings]
      );
    },
    [updateSetting]
  );

  useEffect(() => {
    setChildSave(saveSettings);
  }, [saveSettings, setChildSave]);

  useEffect(() => {
    onChildStateChange({ isSaving, hasPendingChanges });
  }, [isSaving, hasPendingChanges, onChildStateChange]);

  return (
    <FieldSet legend={translate('Options')}>
      {isFetching ? <LoadingIndicator /> : null}

      {!isFetching && error ? (
        <Alert kind={kinds.DANGER}>
          {translate('UnableToLoadIndexerOptions')}
        </Alert>
      ) : null}

      {hasSettings && !isFetching && !error ? (
        <Form>
          <FormGroup>
            <FormLabel>{translate('CertificationCountry')}</FormLabel>

            <FormInputGroup
              type={inputTypes.SELECT}
              name="certificationCountry"
              values={certificationCountryOptions}
              helpText={translate('CertificationCountryHelpText')}
              onChange={handleInputChange}
              {...settings.certificationCountry}
            />
          </FormGroup>
        </Form>
      ) : null}
    </FieldSet>
  );
}

export default MetadataOptions;
