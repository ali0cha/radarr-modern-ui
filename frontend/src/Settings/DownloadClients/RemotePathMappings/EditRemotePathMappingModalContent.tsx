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
import { InputChanged } from 'typings/inputs';
import RemotePathMapping from 'typings/RemotePathMapping';
import translate from 'Utilities/String/translate';
import { useDownloadClientHosts } from '../useDownloadClients';
import {
  NEW_REMOTE_PATH_MAPPING,
  REMOTE_PATH_MAPPINGS_PATH,
  useRemotePathMappings,
} from './useRemotePathMappings';
import styles from './EditRemotePathMappingModalContent.module.css';

interface EditRemotePathMappingModalContentProps {
  id?: number;
  onModalClose: () => void;
  onDeleteRemotePathMappingPress?: () => void;
}

function EditRemotePathMappingModalContent({
  id,
  onModalClose,
  onDeleteRemotePathMappingPress,
}: EditRemotePathMappingModalContentProps) {
  const downloadClientHosts = useDownloadClientHosts();

  const {
    isFetching: isFetchingMappings,
    isPopulated,
    error,
  } = useRemotePathMappings();
  const isFetching = isFetchingMappings && !isPopulated;

  const {
    item,
    validationErrors,
    validationWarnings,
    isSaving,
    saveError,
    updateValue,
    saveItem,
  } = useManageItem<RemotePathMapping>(
    REMOTE_PATH_MAPPINGS_PATH,
    id,
    NEW_REMOTE_PATH_MAPPING,
    onModalClose
  );

  const { host, remotePath, localPath } = item;

  const onInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(
        name as keyof RemotePathMapping,
        value as RemotePathMapping[keyof RemotePathMapping]
      );
    },
    [updateValue]
  );

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {id
          ? translate('EditRemotePathMapping')
          : translate('AddRemotePathMapping')}
      </ModalHeader>

      <ModalBody className={styles.body}>
        {isFetching && <LoadingIndicator />}

        {!isFetching && !!error && (
          <Alert kind={kinds.DANGER}>
            {translate('AddRemotePathMappingError')}
          </Alert>
        )}

        {!isFetching && !error && (
          <Form
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          >
            <FormGroup>
              <FormLabel>{translate('Host')}</FormLabel>

              <FormInputGroup
                type={inputTypes.SELECT}
                name="host"
                helpText={translate('RemotePathMappingHostHelpText')}
                {...host}
                values={downloadClientHosts}
                onChange={onInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('RemotePath')}</FormLabel>

              <FormInputGroup
                type={inputTypes.TEXT}
                name="remotePath"
                helpText={translate('RemotePathMappingRemotePathHelpText')}
                {...remotePath}
                onChange={onInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('LocalPath')}</FormLabel>

              <FormInputGroup
                type={inputTypes.PATH}
                name="localPath"
                includeFiles={false}
                helpText={translate('RemotePathMappingLocalPathHelpText')}
                {...localPath}
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
            onPress={onDeleteRemotePathMappingPress}
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

export default EditRemotePathMappingModalContent;
