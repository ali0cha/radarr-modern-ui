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
import { InputChanged } from 'typings/inputs';
import Notification from 'typings/Notification';
import translate from 'Utilities/String/translate';
import { NOTIFICATIONS_PATH, useNotifications } from '../useNotifications';
import NotificationEventItems from './NotificationEventItems';
import styles from './EditNotificationModalContent.module.css';

const NO_NOTIFICATION = { fields: [] } as unknown as Notification;

export interface EditNotificationModalContentProps {
  id?: number;
  // The notification to start from when it is new
  defaultNotification?: Notification;
  onModalClose: () => void;
  onDeleteNotificationPress?: () => void;
}

function EditNotificationModalContent({
  id,
  defaultNotification = NO_NOTIFICATION,
  onModalClose,
  onDeleteNotificationPress,
}: EditNotificationModalContentProps) {
  const showAdvancedSettings = useShowAdvancedSettings();
  const {
    isFetching: isFetchingNotifications,
    isPopulated,
    error,
  } = useNotifications();
  const isFetching = isFetchingNotifications && !isPopulated;

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
  } = useManageProviderSettings<Notification>(
    id,
    defaultNotification,
    NOTIFICATIONS_PATH
  );

  const wasSaving = usePrevious(isSaving);

  const { implementationName = '', name, tags, fields, message } = item;

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(
        name as keyof Notification,
        value as Notification[keyof Notification]
      );
    },
    [updateValue]
  );

  const handleFieldChange = useCallback(
    ({
      name,
      value,
      additionalProperties = {},
    }: InputChanged & { additionalProperties?: Record<string, unknown> }) => {
      updateFieldValue({ ...additionalProperties, [name]: value });
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
          ? translate('EditConnectionImplementation', { implementationName })
          : translate('AddConnectionImplementation', { implementationName })}
      </ModalHeader>

      <ModalBody>
        {isFetching ? <LoadingIndicator /> : null}

        {!isFetching && !!error ? (
          <Alert kind={kinds.DANGER}>{translate('AddNotificationError')}</Alert>
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

            <NotificationEventItems
              item={item}
              onInputChange={handleInputChange}
            />

            <FormGroup>
              <FormLabel>{translate('Tags')}</FormLabel>

              <FormInputGroup
                type={inputTypes.TAG}
                name="tags"
                helpText={translate('NotificationsTagsMovieHelpText')}
                {...tags}
                onChange={handleInputChange}
              />
            </FormGroup>

            {fields?.map((field) => {
              return (
                <ProviderFieldFormGroup
                  key={field.name}
                  advancedSettings={showAdvancedSettings}
                  provider="notification"
                  providerData={item}
                  {...field}
                  onChange={handleFieldChange}
                />
              );
            })}
          </Form>
        ) : null}
      </ModalBody>

      <ModalFooter>
        {id ? (
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={onDeleteNotificationPress}
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

export default EditNotificationModalContent;
