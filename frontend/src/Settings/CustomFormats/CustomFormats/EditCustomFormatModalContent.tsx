import React, { useCallback, useState } from 'react';
import Alert from 'Components/Alert';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { icons, inputTypes, kinds } from 'Helpers/Props';
import CustomFormat, { CustomFormatSpecification } from 'typings/CustomFormat';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import { useCustomFormats, useManageCustomFormat } from '../useCustomFormats';
import ImportCustomFormatModal from './ImportCustomFormatModal';
import AddSpecificationModal from './Specifications/AddSpecificationModal';
import EditSpecificationModal from './Specifications/EditSpecificationModal';
import Specification from './Specifications/Specification';
import styles from './EditCustomFormatModalContent.module.css';

const NO_CUSTOM_FORMAT = { specifications: [] } as unknown as CustomFormat;

export interface EditCustomFormatModalContentProps {
  id?: number;
  // The custom format to start from when it is new
  defaultCustomFormat?: CustomFormat;
  onModalClose: () => void;
  onDeleteCustomFormatPress?: () => void;
}

function EditCustomFormatModalContent({
  id,
  defaultCustomFormat = NO_CUSTOM_FORMAT,
  onModalClose,
  onDeleteCustomFormatPress,
}: EditCustomFormatModalContentProps) {
  const {
    isFetching: isFetchingCustomFormats,
    isPopulated,
    error,
  } = useCustomFormats();
  const isFetching = isFetchingCustomFormats && !isPopulated;

  const {
    item,
    specifications,
    validationErrors,
    validationWarnings,
    isSaving,
    saveError,
    updateValue,
    saveCustomFormat,
    saveSpecification,
    cloneSpecification,
    deleteSpecification,
    importCustomFormat,
  } = useManageCustomFormat(id, defaultCustomFormat, onModalClose);

  const [isAddSpecificationModalOpen, setIsAddSpecificationModalOpen] =
    useState(false);
  const [isEditSpecificationModalOpen, setIsEditSpecificationModalOpen] =
    useState(false);
  const [isImportCustomFormatModalOpen, setIsImportCustomFormatModalOpen] =
    useState(false);

  // The condition that is edited when it is new: a chosen implementation
  const [newSpecification, setNewSpecification] = useState<
    CustomFormatSpecification | undefined
  >();

  const { name, includeCustomFormatWhenRenaming } = item;

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(
        name as keyof CustomFormat,
        value as CustomFormat[keyof CustomFormat]
      );
    },
    [updateValue]
  );

  const handleAddSpecificationPress = useCallback(() => {
    setIsAddSpecificationModalOpen(true);
  }, []);

  const handleAddSpecificationModalClose = useCallback(() => {
    setIsAddSpecificationModalOpen(false);
  }, []);

  const handleSpecificationSelect = useCallback(
    (specification: CustomFormatSpecification) => {
      setNewSpecification(specification);
      setIsAddSpecificationModalOpen(false);
      setIsEditSpecificationModalOpen(true);
    },
    []
  );

  const handleEditSpecificationModalClose = useCallback(() => {
    setIsEditSpecificationModalOpen(false);
  }, []);

  const handleImportPress = useCallback(() => {
    setIsImportCustomFormatModalOpen(true);
  }, []);

  const handleImportCustomFormatModalClose = useCallback(() => {
    setIsImportCustomFormatModalOpen(false);
  }, []);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {id ? translate('EditCustomFormat') : translate('AddCustomFormat')}
      </ModalHeader>

      <ModalBody>
        <div>
          {isFetching ? <LoadingIndicator /> : null}

          {!isFetching && !!error ? (
            <Alert kind={kinds.DANGER}>
              {translate('AddCustomFormatError')}
            </Alert>
          ) : null}

          {!isFetching && !error ? (
            <div>
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
                  <FormLabel>
                    {translate('IncludeCustomFormatWhenRenaming')}
                  </FormLabel>

                  <FormInputGroup
                    type={inputTypes.CHECK}
                    name="includeCustomFormatWhenRenaming"
                    helpText={translate(
                      'IncludeCustomFormatWhenRenamingHelpText'
                    )}
                    {...includeCustomFormatWhenRenaming}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Form>

              <FieldSet legend={translate('Conditions')}>
                <Alert kind={kinds.INFO}>
                  <div>{translate('CustomFormatsSettingsTriggerInfo')}</div>
                </Alert>

                <div className={styles.customFormats}>
                  {specifications.map((specification) => {
                    return (
                      <Specification
                        key={specification.id}
                        specification={specification}
                        onSave={saveSpecification}
                        onCloneSpecificationPress={cloneSpecification}
                        onConfirmDeleteSpecification={deleteSpecification}
                      />
                    );
                  })}

                  <Card
                    className={styles.addSpecification}
                    onPress={handleAddSpecificationPress}
                  >
                    <div className={styles.center}>
                      <Icon name={icons.ADD} size={45} />
                    </div>
                  </Card>
                </div>
              </FieldSet>

              <AddSpecificationModal
                isOpen={isAddSpecificationModalOpen}
                onSpecificationSelect={handleSpecificationSelect}
                onModalClose={handleAddSpecificationModalClose}
              />

              <EditSpecificationModal
                isOpen={isEditSpecificationModalOpen}
                specification={newSpecification}
                onSave={saveSpecification}
                onModalClose={handleEditSpecificationModalClose}
              />

              <ImportCustomFormatModal
                isOpen={isImportCustomFormatModalOpen}
                onImport={importCustomFormat}
                onModalClose={handleImportCustomFormatModalClose}
              />
            </div>
          ) : null}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className={styles.rightButtons}>
          {id ? (
            <Button
              className={styles.deleteButton}
              kind={kinds.DANGER}
              onPress={onDeleteCustomFormatPress}
            >
              {translate('Delete')}
            </Button>
          ) : null}

          <Button className={styles.deleteButton} onPress={handleImportPress}>
            {translate('Import')}
          </Button>
        </div>

        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <SpinnerErrorButton
          isSpinning={isSaving}
          error={saveError}
          onPress={saveCustomFormat}
        >
          {translate('Save')}
        </SpinnerErrorButton>
      </ModalFooter>
    </ModalContent>
  );
}

export default EditCustomFormatModalContent;
