import React, { useCallback, useEffect } from 'react';
import Alert from 'Components/Alert';
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
import { inputTypes, kinds } from 'Helpers/Props';
import AdvancedSettingsButton from 'Settings/AdvancedSettingsButton';
import { useManageProviderSettings } from 'Settings/useProviderSettings';
import Indexer from 'typings/Indexer';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import { INDEXERS_PATH, useIndexers } from '../useIndexers';
import styles from './EditIndexerModalContent.module.css';

const NO_INDEXER = { fields: [] } as unknown as Indexer;

export interface EditIndexerModalContentProps {
  id?: number;
  // The indexer to start from when it is new
  defaultIndexer?: Indexer;
  onModalClose: () => void;
  onDeleteIndexerPress?: () => void;
}

function EditIndexerModalContent({
  id,
  defaultIndexer = NO_INDEXER,
  onModalClose,
  onDeleteIndexerPress,
}: EditIndexerModalContentProps) {
  const showAdvancedSettings = useShowAdvancedSettings();
  const { isFetching: isFetchingIndexers, isPopulated, error } = useIndexers();
  const isFetching = isFetchingIndexers && !isPopulated;

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
  } = useManageProviderSettings<Indexer>(id, defaultIndexer, INDEXERS_PATH);

  const wasSaving = usePrevious(isSaving);

  const {
    implementationName = '',
    name,
    enableRss,
    enableAutomaticSearch,
    enableInteractiveSearch,
    supportsRss,
    supportsSearch,
    tags,
    fields,
    priority,
    protocol,
    downloadClientId,
  } = item;

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(name as keyof Indexer, value as Indexer[keyof Indexer]);
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
          ? translate('EditIndexerImplementation', { implementationName })
          : translate('AddIndexerImplementation', { implementationName })}
      </ModalHeader>

      <ModalBody>
        {isFetching ? <LoadingIndicator /> : null}

        {!isFetching && error ? (
          <Alert kind={kinds.DANGER}>{translate('AddIndexerError')}</Alert>
        ) : null}

        {!isFetching && !error ? (
          <Form
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          >
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
              <FormLabel>{translate('EnableRss')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="enableRss"
                helpText={
                  supportsRss.value ? translate('EnableRssHelpText') : undefined
                }
                helpTextWarning={
                  supportsRss.value
                    ? undefined
                    : translate('RssIsNotSupportedWithThisIndexer')
                }
                isDisabled={!supportsRss.value}
                {...enableRss}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('EnableAutomaticSearch')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="enableAutomaticSearch"
                helpText={
                  supportsSearch.value
                    ? translate('EnableAutomaticSearchHelpText')
                    : undefined
                }
                helpTextWarning={
                  supportsSearch.value
                    ? undefined
                    : translate('SearchIsNotSupportedWithThisIndexer')
                }
                isDisabled={!supportsSearch.value}
                {...enableAutomaticSearch}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('EnableInteractiveSearch')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="enableInteractiveSearch"
                helpText={
                  supportsSearch.value
                    ? translate('EnableInteractiveSearchHelpText')
                    : undefined
                }
                helpTextWarning={
                  supportsSearch.value
                    ? undefined
                    : translate('SearchIsNotSupportedWithThisIndexer')
                }
                isDisabled={!supportsSearch.value}
                {...enableInteractiveSearch}
                onChange={handleInputChange}
              />
            </FormGroup>

            {fields?.map((field) => {
              return (
                <ProviderFieldFormGroup
                  key={field.name}
                  advancedSettings={showAdvancedSettings}
                  provider="indexer"
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
              <FormLabel>{translate('IndexerPriority')}</FormLabel>

              <FormInputGroup
                type={inputTypes.NUMBER}
                name="priority"
                helpText={translate('IndexerPriorityHelpText')}
                min={1}
                max={50}
                {...priority}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup
              advancedSettings={showAdvancedSettings}
              isAdvanced={true}
            >
              <FormLabel>{translate('DownloadClient')}</FormLabel>

              <FormInputGroup
                type={inputTypes.DOWNLOAD_CLIENT_SELECT}
                name="downloadClientId"
                helpText={translate('IndexerDownloadClientHelpText')}
                {...downloadClientId}
                includeAny={true}
                protocol={protocol.value}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('Tags')}</FormLabel>

              <FormInputGroup
                type={inputTypes.TAG}
                name="tags"
                helpText={translate('IndexerTagMovieHelpText')}
                {...tags}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        ) : null}
      </ModalBody>

      <ModalFooter>
        {id ? (
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={onDeleteIndexerPress}
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

export default EditIndexerModalContent;
