import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputButton from 'Components/Form/FormInputButton';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';
import useShowAdvancedSettings from 'Helpers/Hooks/useShowAdvancedSettings';
import { inputTypes, kinds, sizes } from 'Helpers/Props';
import { useManageSettings } from 'Settings/useSettings';
import { InputChanged } from 'typings/inputs';
import NamingConfig from 'typings/Settings/NamingConfig';
import {
  OnChildStateChange,
  SetChildSave,
} from 'typings/Settings/SettingsState';
import translate from 'Utilities/String/translate';
import NamingModal from './NamingModal';
import { useNamingExamples } from './useNamingExamples';
import styles from './Naming.module.css';

const PATH = '/config/naming';

interface NamingModalOptions {
  name: keyof Pick<NamingConfig, 'standardMovieFormat' | 'movieFolderFormat'>;
  movie?: boolean;
  additional?: boolean;
}

interface NamingProps {
  setChildSave: SetChildSave;
  onChildStateChange: OnChildStateChange;
}

function Naming({ setChildSave, onChildStateChange }: NamingProps) {
  const advancedSettings = useShowAdvancedSettings();

  const {
    isFetching,
    isSaving,
    error,
    settings,
    hasSettings,
    hasPendingChanges,
    updateSetting,
    saveSettings,
  } = useManageSettings<NamingConfig>(PATH);

  // The values, with the changes not saved yet: what the examples are for
  const namingValues = useMemo(() => {
    if (!hasSettings) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(settings).map(([key, setting]) => [
        key,
        (setting as { value: unknown }).value,
      ])
    ) as unknown as NamingConfig;
  }, [hasSettings, settings]);

  const { examples, isPopulated: examplesPopulated } =
    useNamingExamples(namingValues);

  const [isNamingModalOpen, setNamingModalOpen, setNamingModalClosed] =
    useModalOpenState(false);
  const [namingModalOptions, setNamingModalOptions] =
    useState<NamingModalOptions | null>(null);

  useEffect(() => {
    setChildSave(saveSettings);
  }, [saveSettings, setChildSave]);

  useEffect(() => {
    onChildStateChange({ isSaving, hasPendingChanges });
  }, [isSaving, hasPendingChanges, onChildStateChange]);

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateSetting(
        name as keyof NamingConfig,
        value as NamingConfig[keyof NamingConfig]
      );
    },
    [updateSetting]
  );

  const onStandardNamingModalOpenClick = useCallback(() => {
    setNamingModalOpen();

    setNamingModalOptions({
      name: 'standardMovieFormat',
      movie: true,
      additional: true,
    });
  }, [setNamingModalOpen, setNamingModalOptions]);

  const onMovieFolderNamingModalOpenClick = useCallback(() => {
    setNamingModalOpen();

    setNamingModalOptions({
      name: 'movieFolderFormat',
    });
  }, [setNamingModalOpen, setNamingModalOptions]);

  const renameMovies = hasSettings && settings.renameMovies.value;
  const replaceIllegalCharacters =
    hasSettings && settings.replaceIllegalCharacters.value;

  const colonReplacementOptions = [
    { key: 'delete', value: translate('Delete') },
    { key: 'dash', value: translate('ReplaceWithDash') },
    { key: 'spaceDash', value: translate('ReplaceWithSpaceDash') },
    { key: 'spaceDashSpace', value: translate('ReplaceWithSpaceDashSpace') },
    {
      key: 'smart',
      value: translate('SmartReplace'),
      hint: translate('SmartReplaceHint'),
    },
  ];

  const standardMovieFormatHelpTexts = [];
  const standardMovieFormatErrors = [];
  const movieFolderFormatHelpTexts = [];
  const movieFolderFormatErrors = [];

  if (examplesPopulated) {
    if (examples.movieExample) {
      standardMovieFormatHelpTexts.push(
        `${translate('Movie')}: ${examples.movieExample}`
      );
    } else {
      standardMovieFormatErrors.push({
        message: translate('MovieInvalidFormat'),
      });
    }

    if (examples.movieFolderExample) {
      movieFolderFormatHelpTexts.push(
        `${translate('Example')}: ${examples.movieFolderExample}`
      );
    } else {
      movieFolderFormatErrors.push({ message: translate('InvalidFormat') });
    }
  }

  return (
    <FieldSet legend={translate('MovieNaming')}>
      {isFetching ? <LoadingIndicator /> : null}

      {!isFetching && error ? (
        <Alert kind={kinds.DANGER}>
          {translate('NamingSettingsLoadError')}
        </Alert>
      ) : null}

      {hasSettings && !isFetching && !error ? (
        <Form>
          <FormGroup size={sizes.MEDIUM}>
            <FormLabel>{translate('RenameMovies')}</FormLabel>

            <FormInputGroup
              type={inputTypes.CHECK}
              name="renameMovies"
              helpText={translate('RenameMoviesHelpText')}
              onChange={handleInputChange}
              {...settings.renameMovies}
            />
          </FormGroup>

          <FormGroup size={sizes.MEDIUM}>
            <FormLabel>{translate('ReplaceIllegalCharacters')}</FormLabel>

            <FormInputGroup
              type={inputTypes.CHECK}
              name="replaceIllegalCharacters"
              helpText={translate('ReplaceIllegalCharactersHelpText')}
              onChange={handleInputChange}
              {...settings.replaceIllegalCharacters}
            />
          </FormGroup>

          {replaceIllegalCharacters ? (
            <FormGroup size={sizes.MEDIUM}>
              <FormLabel>{translate('ColonReplacement')}</FormLabel>

              <FormInputGroup
                type={inputTypes.SELECT}
                name="colonReplacementFormat"
                values={colonReplacementOptions}
                helpText={translate('ColonReplacementFormatHelpText')}
                onChange={handleInputChange}
                {...settings.colonReplacementFormat}
              />
            </FormGroup>
          ) : null}

          {renameMovies ? (
            <FormGroup size={sizes.LARGE}>
              <FormLabel>{translate('StandardMovieFormat')}</FormLabel>

              <FormInputGroup
                inputClassName={styles.namingInput}
                type={inputTypes.TEXT}
                name="standardMovieFormat"
                buttons={
                  <FormInputButton onPress={onStandardNamingModalOpenClick}>
                    ?
                  </FormInputButton>
                }
                onChange={handleInputChange}
                {...settings.standardMovieFormat}
                helpTexts={standardMovieFormatHelpTexts}
                errors={[
                  ...standardMovieFormatErrors,
                  ...settings.standardMovieFormat.errors,
                ]}
              />
            </FormGroup>
          ) : null}

          <FormGroup
            advancedSettings={advancedSettings}
            isAdvanced={true}
            size={sizes.MEDIUM}
          >
            <FormLabel>{translate('MovieFolderFormat')}</FormLabel>

            <FormInputGroup
              inputClassName={styles.namingInput}
              type={inputTypes.TEXT}
              name="movieFolderFormat"
              buttons={
                <FormInputButton onPress={onMovieFolderNamingModalOpenClick}>
                  ?
                </FormInputButton>
              }
              onChange={handleInputChange}
              {...settings.movieFolderFormat}
              helpTexts={[
                translate('MovieFolderFormatHelpText'),
                ...movieFolderFormatHelpTexts,
              ]}
              helpTextWarning={translate(
                'MovieFolderFormatHelpTextDeprecatedWarning'
              )}
              errors={[
                ...movieFolderFormatErrors,
                ...settings.movieFolderFormat.errors,
              ]}
            />
          </FormGroup>

          {namingModalOptions ? (
            <NamingModal
              isOpen={isNamingModalOpen}
              {...namingModalOptions}
              value={settings[namingModalOptions.name].value}
              onInputChange={handleInputChange}
              onModalClose={setNamingModalClosed}
            />
          ) : null}
        </Form>
      ) : null}
    </FieldSet>
  );
}

export default Naming;
