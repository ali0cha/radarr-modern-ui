import React, { useCallback, useEffect } from 'react';
import MovieMinimumAvailabilityPopoverContent from 'AddMovie/MovieMinimumAvailabilityPopoverContent';
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import ProviderFieldFormGroup from 'Components/Form/ProviderFieldFormGroup';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Popover from 'Components/Tooltip/Popover';
import usePrevious from 'Helpers/Hooks/usePrevious';
import useShowAdvancedSettings from 'Helpers/Hooks/useShowAdvancedSettings';
import { icons, inputTypes, kinds, tooltipPositions } from 'Helpers/Props';
import AdvancedSettingsButton from 'Settings/AdvancedSettingsButton';
import { useManageProviderSettings } from 'Settings/useProviderSettings';
import ImportList from 'typings/ImportList';
import { InputChanged } from 'typings/inputs';
import formatShortTimeSpan from 'Utilities/Date/formatShortTimeSpan';
import translate from 'Utilities/String/translate';
import { IMPORT_LISTS_PATH, useImportLists } from '../useImportLists';
import styles from './EditImportListModalContent.module.css';

const NO_IMPORT_LIST = { fields: [] } as unknown as ImportList;

export interface EditImportListModalContentProps {
  id?: number;
  // The import list to start from when it is new
  defaultImportList?: ImportList;
  onModalClose: () => void;
  onDeleteImportListPress?: () => void;
}

function EditImportListModalContent({
  id,
  defaultImportList = NO_IMPORT_LIST,
  onModalClose,
  onDeleteImportListPress,
}: EditImportListModalContentProps) {
  const showAdvancedSettings = useShowAdvancedSettings();
  const {
    isFetching: isFetchingImportLists,
    isPopulated,
    error,
  } = useImportLists();
  const isFetching = isFetchingImportLists && !isPopulated;

  const {
    isSaving,
    isTesting,
    saveError,
    item,
    validationErrors,
    validationWarnings,
    updateValue,
    updateFieldValue,
    saveProvider,
    testProvider,
  } = useManageProviderSettings<ImportList>(
    id,
    defaultImportList,
    IMPORT_LISTS_PATH
  );

  const wasSaving = usePrevious(isSaving);

  const {
    implementationName = '',
    name,
    enabled,
    enableAuto,
    minRefreshInterval,
    monitor,
    minimumAvailability,
    rootFolderPath,
    qualityProfileId,
    searchOnAdd,
    tags,
    fields,
  } = item;

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(
        name as keyof ImportList,
        value as ImportList[keyof ImportList]
      );
    },
    [updateValue]
  );

  const handleFieldChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateFieldValue({ [name]: value });
    },
    [updateFieldValue]
  );

  useEffect(() => {
    if (wasSaving && !isSaving && !saveError) {
      onModalClose();
    }
  }, [isSaving, wasSaving, saveError, onModalClose]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {id
          ? translate('EditImportListImplementation', { implementationName })
          : translate('AddImportListImplementation', { implementationName })}
      </ModalHeader>

      <ModalBody>
        {isFetching ? <LoadingIndicator /> : null}

        {!isFetching && !!error ? (
          <Alert kind={kinds.DANGER}>{translate('AddListError')}</Alert>
        ) : null}

        {!isFetching && !error ? (
          <Form
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          >
            <Alert kind={kinds.INFO} className={styles.message}>
              {translate('ListWillRefreshEveryInterval', {
                refreshInterval: formatShortTimeSpan(minRefreshInterval.value),
              })}
            </Alert>

            <FormGroup>
              <FormLabel>{translate('Name')}</FormLabel>

              <FormInputGroup
                type={inputTypes.TEXT}
                name="name"
                {...name}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('Enable')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="enabled"
                helpText={translate('ListEnabledHelpText')}
                {...enabled}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('EnableAutomaticAdd')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="enableAuto"
                helpText={translate('EnableAutomaticAddMovieHelpText')}
                {...enableAuto}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('Monitor')}</FormLabel>

              <FormInputGroup
                type={inputTypes.MONITOR_MOVIES_SELECT}
                name="monitor"
                helpText={translate('ListMonitorMovieHelpText')}
                {...monitor}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('SearchOnAdd')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="searchOnAdd"
                helpText={translate('ListSearchOnAddMovieHelpText')}
                {...searchOnAdd}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {translate('MinimumAvailability')}

                <Popover
                  anchor={
                    <Icon className={styles.labelIcon} name={icons.INFO} />
                  }
                  title={translate('MinimumAvailability')}
                  body={<MovieMinimumAvailabilityPopoverContent />}
                  position={tooltipPositions.RIGHT}
                />
              </FormLabel>

              <FormInputGroup
                type={inputTypes.AVAILABILITY_SELECT}
                name="minimumAvailability"
                {...minimumAvailability}
                helpLink="https://wiki.servarr.com/radarr/faq#what-is-minimum-availability"
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('QualityProfile')}</FormLabel>

              <FormInputGroup
                type={inputTypes.QUALITY_PROFILE_SELECT}
                name="qualityProfileId"
                helpText={translate('ListQualityProfileHelpText')}
                {...qualityProfileId}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('RootFolder')}</FormLabel>

              <FormInputGroup
                type={inputTypes.ROOT_FOLDER_SELECT}
                name="rootFolderPath"
                helpText={translate('ListRootFolderHelpText')}
                {...rootFolderPath}
                includeMissingValue={true}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('RadarrTags')}</FormLabel>

              <FormInputGroup
                type={inputTypes.TAG}
                name="tags"
                helpText={translate('ListTagsHelpText')}
                {...tags}
                onChange={handleInputChange}
              />
            </FormGroup>

            {fields?.length ? (
              <div>
                {fields.map((field) => {
                  return (
                    <ProviderFieldFormGroup
                      key={field.name}
                      {...field}
                      advancedSettings={showAdvancedSettings}
                      provider="importList"
                      providerData={item}
                      onChange={handleFieldChange}
                    />
                  );
                })}
              </div>
            ) : null}
          </Form>
        ) : null}
      </ModalBody>
      <ModalFooter>
        {id ? (
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={onDeleteImportListPress}
          >
            {translate('Delete')}
          </Button>
        ) : null}

        <AdvancedSettingsButton showLabel={false} />

        <SpinnerErrorButton
          isSpinning={isTesting}
          error={saveError}
          onPress={testProvider}
        >
          {translate('Test')}
        </SpinnerErrorButton>

        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <SpinnerErrorButton
          isSpinning={isSaving}
          error={saveError}
          onPress={saveProvider}
        >
          {translate('Save')}
        </SpinnerErrorButton>
      </ModalFooter>
    </ModalContent>
  );
}

export default EditImportListModalContent;
