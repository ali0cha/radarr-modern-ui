import React, { useCallback, useEffect } from 'react';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import useShowAdvancedSettings from 'Helpers/Hooks/useShowAdvancedSettings';
import { inputTypes, kinds } from 'Helpers/Props';
import { useManageSettings } from 'Settings/useSettings';
import { InputChanged } from 'typings/inputs';
import IndexerOptionsSettings from 'typings/Settings/IndexerOptions';
import {
  OnChildStateChange,
  SetChildSave,
} from 'typings/Settings/SettingsState';
import translate from 'Utilities/String/translate';

const PATH = '/config/indexer';

interface IndexerOptionsProps {
  setChildSave: SetChildSave;
  onChildStateChange: OnChildStateChange;
}

function IndexerOptions({
  setChildSave,
  onChildStateChange,
}: IndexerOptionsProps) {
  const {
    isFetching,
    isPopulated,
    isSaving,
    error,
    settings,
    hasSettings,
    hasPendingChanges,
    updateSetting,
    saveSettings,
  } = useManageSettings<IndexerOptionsSettings>(PATH);

  const showAdvancedSettings = useShowAdvancedSettings();

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateSetting(
        name as keyof IndexerOptionsSettings,
        value as IndexerOptionsSettings[keyof IndexerOptionsSettings]
      );
    },
    [updateSetting]
  );

  const handleWhitelistedSubtitleChange = useCallback(
    ({ name, value }: InputChanged<string[] | null>) => {
      // The server expects a comma separated string
      updateSetting(
        name as keyof IndexerOptionsSettings,
        value?.join(
          ','
        ) as unknown as IndexerOptionsSettings[keyof IndexerOptionsSettings]
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
  }, [hasPendingChanges, isSaving, onChildStateChange]);

  return (
    <FieldSet legend={translate('Options')}>
      {isFetching ? <LoadingIndicator /> : null}

      {!isFetching && error ? (
        <Alert kind={kinds.DANGER}>
          {translate('IndexerOptionsLoadError')}
        </Alert>
      ) : null}

      {hasSettings && isPopulated && !error ? (
        <Form>
          <FormGroup>
            <FormLabel>{translate('MinimumAge')}</FormLabel>

            <FormInputGroup
              type={inputTypes.NUMBER}
              name="minimumAge"
              min={0}
              unit="minutes"
              helpText={translate('MinimumAgeHelpText')}
              onChange={handleInputChange}
              {...settings.minimumAge}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>{translate('Retention')}</FormLabel>

            <FormInputGroup
              type={inputTypes.NUMBER}
              name="retention"
              min={0}
              unit="days"
              helpText={translate('RetentionHelpText')}
              onChange={handleInputChange}
              {...settings.retention}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>{translate('MaximumSize')}</FormLabel>

            <FormInputGroup
              type={inputTypes.NUMBER}
              name="maximumSize"
              min={0}
              unit="MB"
              helpText={translate('MaximumSizeHelpText')}
              onChange={handleInputChange}
              {...settings.maximumSize}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>{translate('PreferIndexerFlags')}</FormLabel>

            <FormInputGroup
              type={inputTypes.CHECK}
              name="preferIndexerFlags"
              helpText={translate('PreferIndexerFlagsHelpText')}
              helpLink="https://wiki.servarr.com/radarr/settings#indexer-flags"
              onChange={handleInputChange}
              {...settings.preferIndexerFlags}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>{translate('AvailabilityDelay')}</FormLabel>

            <FormInputGroup
              type={inputTypes.NUMBER}
              name="availabilityDelay"
              unit="days"
              helpText={translate('AvailabilityDelayHelpText')}
              onChange={handleInputChange}
              {...settings.availabilityDelay}
            />
          </FormGroup>

          <FormGroup advancedSettings={showAdvancedSettings} isAdvanced={true}>
            <FormLabel>{translate('RssSyncInterval')}</FormLabel>

            <FormInputGroup
              type={inputTypes.NUMBER}
              name="rssSyncInterval"
              min={0}
              max={120}
              unit="minutes"
              helpText={translate('RssSyncIntervalHelpText')}
              helpTextWarning={translate('RssSyncIntervalHelpTextWarning')}
              helpLink="https://wiki.servarr.com/radarr/faq#how-does-radarr-work"
              onChange={handleInputChange}
              {...settings.rssSyncInterval}
            />
          </FormGroup>

          <FormGroup advancedSettings={showAdvancedSettings} isAdvanced={true}>
            <FormLabel>{translate('WhitelistedSubtitleTags')}</FormLabel>

            <FormInputGroup
              type={inputTypes.TEXT_TAG}
              name="whitelistedHardcodedSubs"
              helpText={translate('WhitelistedHardcodedSubsHelpText')}
              onChange={handleWhitelistedSubtitleChange}
              {...settings.whitelistedHardcodedSubs}
            />
          </FormGroup>

          <FormGroup advancedSettings={showAdvancedSettings} isAdvanced={true}>
            <FormLabel>{translate('AllowHardcodedSubs')}</FormLabel>

            <FormInputGroup
              type={inputTypes.CHECK}
              name="allowHardcodedSubs"
              helpText={translate('AllowHardcodedSubsHelpText')}
              onChange={handleInputChange}
              {...settings.allowHardcodedSubs}
            />
          </FormGroup>
        </Form>
      ) : null}
    </FieldSet>
  );
}

export default IndexerOptions;
