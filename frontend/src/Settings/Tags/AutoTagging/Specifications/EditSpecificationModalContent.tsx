import React, { useCallback } from 'react';
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import ProviderFieldFormGroup from 'Components/Form/ProviderFieldFormGroup';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import useShowAdvancedSettings from 'Helpers/Hooks/useShowAdvancedSettings';
import { inputTypes, kinds } from 'Helpers/Props';
import { useEditSpecification } from 'Settings/useSpecifications';
import { AutoTaggingSpecification } from 'typings/AutoTagging';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import styles from './EditSpecificationModalContent.module.css';

const NO_SPECIFICATION = { fields: [] } as unknown as AutoTaggingSpecification;

export interface EditSpecificationModalContentProps {
  // The condition to edit, or the one to start from when it is new
  specification?: AutoTaggingSpecification;
  onSave: (specification: AutoTaggingSpecification) => void;
  onModalClose: () => void;
  onDeleteSpecificationPress?: () => void;
}

function EditSpecificationModalContent({
  specification = NO_SPECIFICATION,
  onSave,
  onModalClose,
  onDeleteSpecificationPress,
}: EditSpecificationModalContentProps) {
  const showAdvancedSettings = useShowAdvancedSettings();

  const { item, updateValue, updateFieldValue, getSpecification } =
    useEditSpecification(specification);

  const { id, implementationName = '', name, negate, required, fields } = item;

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(
        name as keyof AutoTaggingSpecification,
        value as AutoTaggingSpecification[keyof AutoTaggingSpecification]
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

  const handleSavePress = useCallback(() => {
    onSave(getSpecification());
    onModalClose();
  }, [getSpecification, onSave, onModalClose]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {id?.value
          ? translate('EditConditionImplementation', { implementationName })
          : translate('AddConditionImplementation', { implementationName })}
      </ModalHeader>

      <ModalBody>
        <Form>
          {fields?.some((x) => x.label === 'Regular Expression') ? (
            <Alert kind={kinds.INFO}>
              <div>
                <InlineMarkdown
                  data={translate('ConditionUsingRegularExpressions')}
                />
              </div>

              <div>
                <InlineMarkdown
                  data={translate('RegularExpressionsTutorialLink', {
                    url: 'https://www.regular-expressions.info/tutorial.html',
                  })}
                />
              </div>

              <div>
                <InlineMarkdown
                  data={translate('RegularExpressionsCanBeTested', {
                    url: 'http://regexstorm.net/tester',
                  })}
                />
              </div>
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

          {fields?.map((field) => {
            return (
              <ProviderFieldFormGroup
                key={field.name}
                advancedSettings={showAdvancedSettings}
                provider="specifications"
                providerData={item}
                {...field}
                onChange={handleFieldChange}
              />
            );
          })}

          <FormGroup>
            <FormLabel>{translate('Negate')}</FormLabel>

            <FormInputGroup
              type={inputTypes.CHECK}
              name="negate"
              {...negate}
              helpText={translate('AutoTaggingNegateHelpText', {
                implementationName,
              })}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>{translate('Required')}</FormLabel>

            <FormInputGroup
              type={inputTypes.CHECK}
              name="required"
              {...required}
              helpText={translate('AutoTaggingRequiredHelpText', {
                implementationName,
              })}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter>
        {id?.value ? (
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={onDeleteSpecificationPress}
          >
            {translate('Delete')}
          </Button>
        ) : null}

        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <SpinnerErrorButton isSpinning={false} onPress={handleSavePress}>
          {translate('Save')}
        </SpinnerErrorButton>
      </ModalFooter>
    </ModalContent>
  );
}

export default EditSpecificationModalContent;
