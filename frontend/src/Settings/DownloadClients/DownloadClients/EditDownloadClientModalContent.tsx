import React, { useCallback, useEffect } from 'react';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import ProviderFieldFormGroup from 'Components/Form/ProviderFieldFormGroup';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import usePrevious from 'Helpers/Hooks/usePrevious';
import useShowAdvancedSettings from 'Helpers/Hooks/useShowAdvancedSettings';
import { inputTypes, kinds, sizes } from 'Helpers/Props';
import AdvancedSettingsButton from 'Settings/AdvancedSettingsButton';
import { useManageProviderSettings } from 'Settings/useProviderSettings';
import DownloadClient from 'typings/DownloadClient';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import {
  DOWNLOAD_CLIENTS_PATH,
  useDownloadClients,
} from '../useDownloadClients';
import styles from './EditDownloadClientModalContent.module.css';

const NO_DOWNLOAD_CLIENT = { fields: [] } as unknown as DownloadClient;

export interface EditDownloadClientModalContentProps {
  id?: number;
  // The download client to start from when it is new
  defaultDownloadClient?: DownloadClient;
  onModalClose: () => void;
  onDeleteDownloadClientPress?: () => void;
}

function EditDownloadClientModalContent({
  id,
  defaultDownloadClient = NO_DOWNLOAD_CLIENT,
  onModalClose,
  onDeleteDownloadClientPress,
}: EditDownloadClientModalContentProps) {
  const showAdvancedSettings = useShowAdvancedSettings();
  const {
    isFetching: isFetchingDownloadClients,
    isPopulated,
    error,
  } = useDownloadClients();
  const isFetching = isFetchingDownloadClients && !isPopulated;

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
  } = useManageProviderSettings<DownloadClient>(
    id,
    defaultDownloadClient,
    DOWNLOAD_CLIENTS_PATH
  );

  const wasSaving = usePrevious(isSaving);

  const {
    implementationName = '',
    name,
    enable,
    priority,
    removeCompletedDownloads,
    removeFailedDownloads,
    fields,
    tags,
    message,
  } = item;

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(
        name as keyof DownloadClient,
        value as DownloadClient[keyof DownloadClient]
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
    if (!isSaving && wasSaving && !saveError) {
      onModalClose();
    }
  }, [isSaving, wasSaving, saveError, onModalClose]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {id
          ? translate('EditDownloadClientImplementation', {
              implementationName,
            })
          : translate('AddDownloadClientImplementation', {
              implementationName,
            })}
      </ModalHeader>

      <ModalBody>
        {isFetching ? <LoadingIndicator /> : null}

        {!isFetching && !!error ? (
          <Alert kind={kinds.DANGER}>
            {translate('AddDownloadClientError')}
          </Alert>
        ) : null}

        {!isFetching && !error ? (
          <Form
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          >
            {message ? (
              <Alert className={styles.message} kind={message.value.type}>
                {message.value.message}
              </Alert>
            ) : null}

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
                name="enable"
                {...enable}
                onChange={handleInputChange}
              />
            </FormGroup>

            {fields?.map((field) => {
              return (
                <ProviderFieldFormGroup
                  key={field.name}
                  advancedSettings={showAdvancedSettings}
                  provider="downloadClient"
                  providerData={item}
                  {...field}
                  onChange={handleFieldChange}
                />
              );
            })}

            <FormGroup
              advancedSettings={showAdvancedSettings}
              isAdvanced={true}
            >
              <FormLabel>{translate('ClientPriority')}</FormLabel>

              <FormInputGroup
                type={inputTypes.NUMBER}
                name="priority"
                helpText={translate('DownloadClientPriorityHelpText')}
                min={1}
                max={50}
                {...priority}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('Tags')}</FormLabel>

              <FormInputGroup
                type={inputTypes.TAG}
                name="tags"
                helpText={translate('DownloadClientMovieTagHelpText')}
                {...tags}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FieldSet
              size={sizes.SMALL}
              legend={translate('CompletedDownloadHandling')}
            >
              <FormGroup>
                <FormLabel>{translate('RemoveCompleted')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.CHECK}
                  name="removeCompletedDownloads"
                  helpText={translate('RemoveCompletedDownloadsHelpText')}
                  {...removeCompletedDownloads}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>{translate('RemoveFailed')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.CHECK}
                  name="removeFailedDownloads"
                  helpText={translate('RemoveFailedDownloadsHelpText')}
                  {...removeFailedDownloads}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FieldSet>
          </Form>
        ) : null}
      </ModalBody>

      <ModalFooter>
        {id ? (
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={onDeleteDownloadClientPress}
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

export default EditDownloadClientModalContent;
