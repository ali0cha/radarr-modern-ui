import React, { useCallback, useEffect } from 'react';
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import ProviderFieldFormGroup from 'Components/Form/ProviderFieldFormGroup';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import usePrevious from 'Helpers/Hooks/usePrevious';
import useShowAdvancedSettings from 'Helpers/Hooks/useShowAdvancedSettings';
import { inputTypes } from 'Helpers/Props';
import { useManageProviderSettings } from 'Settings/useProviderSettings';
import { InputChanged } from 'typings/inputs';
import MetadataModel from 'typings/Metadata';
import translate from 'Utilities/String/translate';
import { METADATA_PATH } from './useMetadata';
import styles from './EditMetadataModalContent.module.css';

const NO_METADATA = { fields: [] } as unknown as MetadataModel;

export interface EditMetadataModalContentProps {
  id: number;
  onModalClose: () => void;
}

function EditMetadataModalContent({
  id,
  onModalClose,
}: EditMetadataModalContentProps) {
  const advancedSettings = useShowAdvancedSettings();

  const {
    isSaving,
    saveError,
    item,
    validationErrors,
    validationWarnings,
    updateValue,
    updateFieldValue,
    saveProvider,
  } = useManageProviderSettings<MetadataModel>(id, NO_METADATA, METADATA_PATH);

  const wasSaving = usePrevious(isSaving);

  const { name, enable, fields, message } = item;

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(
        name as keyof MetadataModel,
        value as MetadataModel[keyof MetadataModel]
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
        {translate('EditMetadata', { metadataType: name.value })}
      </ModalHeader>

      <ModalBody>
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
            <FormLabel>{translate('Enable')}</FormLabel>

            <FormInputGroup
              type={inputTypes.CHECK}
              name="enable"
              helpText={translate('EnableMetadataHelpText')}
              {...enable}
              onChange={handleInputChange}
            />
          </FormGroup>

          {fields.map((field) => {
            return (
              <ProviderFieldFormGroup
                key={field.name}
                advancedSettings={advancedSettings}
                provider="metadata"
                {...field}
                isDisabled={!enable.value}
                onChange={handleFieldChange}
              />
            );
          })}
        </Form>
      </ModalBody>

      <ModalFooter>
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

export default EditMetadataModalContent;
