import React, { useCallback } from 'react';
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { inputTypes, kinds } from 'Helpers/Props';
import { useManageItem } from 'Settings/useManageItem';
import { useProviderSettings } from 'Settings/useProviderSettings';
import ImportListExclusion from 'typings/ImportListExclusion';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import {
  IMPORT_LIST_EXCLUSIONS_PATH,
  NEW_IMPORT_LIST_EXCLUSION,
  useInvalidateImportListExclusions,
} from './useImportListExclusions';
import styles from './EditImportListExclusionModalContent.module.css';

interface EditImportListExclusionModalContentProps {
  id?: number;
  onModalClose: () => void;
  onDeleteImportListExclusionPress?: () => void;
}

function EditImportListExclusionModalContent({
  id,
  onModalClose,
  onDeleteImportListExclusionPress,
}: EditImportListExclusionModalContentProps) {
  const invalidateExclusions = useInvalidateImportListExclusions();

  const {
    isFetching: isFetchingExclusions,
    isSuccess,
    error,
  } = useProviderSettings<ImportListExclusion>(IMPORT_LIST_EXCLUSIONS_PATH);
  const isFetching = isFetchingExclusions && !isSuccess;

  const handleSaved = useCallback(() => {
    invalidateExclusions();
    onModalClose();
  }, [invalidateExclusions, onModalClose]);

  const {
    item,
    validationErrors,
    validationWarnings,
    isSaving,
    saveError,
    updateValue,
    saveItem,
  } = useManageItem<ImportListExclusion>(
    IMPORT_LIST_EXCLUSIONS_PATH,
    id,
    NEW_IMPORT_LIST_EXCLUSION,
    handleSaved
  );

  const { movieTitle, movieYear, tmdbId } = item;

  const onInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(
        name as keyof ImportListExclusion,
        value as ImportListExclusion[keyof ImportListExclusion]
      );
    },
    [updateValue]
  );

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {id
          ? translate('EditImportListExclusion')
          : translate('AddImportListExclusion')}
      </ModalHeader>

      <ModalBody className={styles.body}>
        {isFetching && <LoadingIndicator />}

        {!isFetching && !!error && (
          <Alert kind={kinds.DANGER}>
            {translate('AddImportListExclusionError')}
          </Alert>
        )}

        {!isFetching && !error && (
          <Form
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          >
            <FormGroup>
              <FormLabel>{translate('TMDBId')}</FormLabel>

              <FormInputGroup
                type={inputTypes.NUMBER}
                name="tmdbId"
                helpText={translate('TmdbIdExcludeHelpText')}
                {...tmdbId}
                onChange={onInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('Title')}</FormLabel>

              <FormInputGroup
                type={inputTypes.TEXT}
                name="movieTitle"
                helpText={translate('MovieTitleToExcludeHelpText')}
                {...movieTitle}
                onChange={onInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('Year')}</FormLabel>

              <FormInputGroup
                type={inputTypes.NUMBER}
                name="movieYear"
                helpText={translate('MovieYearToExcludeHelpText')}
                {...movieYear}
                onChange={onInputChange}
              />
            </FormGroup>
          </Form>
        )}
      </ModalBody>

      <ModalFooter>
        {id ? (
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={onDeleteImportListExclusionPress}
          >
            {translate('Delete')}
          </Button>
        ) : null}

        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <SpinnerErrorButton
          isSpinning={isSaving}
          error={saveError}
          onPress={saveItem}
        >
          {translate('Save')}
        </SpinnerErrorButton>
      </ModalFooter>
    </ModalContent>
  );
}

export default EditImportListExclusionModalContent;
