import React from 'react';
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { kinds } from 'Helpers/Props';
import { useProviderSchema } from 'Settings/useProviderSettings';
import Notification from 'typings/Notification';
import translate from 'Utilities/String/translate';
import { NOTIFICATIONS_PATH } from '../useNotifications';
import AddNotificationItem from './AddNotificationItem';
import styles from './AddNotificationModalContent.module.css';

interface AddNotificationModalContentProps {
  onNotificationSelect: (notification: Notification) => void;
  onModalClose: () => void;
}

function AddNotificationModalContent({
  onNotificationSelect,
  onModalClose,
}: AddNotificationModalContentProps) {
  const {
    data: schema,
    isFetching: isSchemaFetching,
    isSuccess: isSchemaPopulated,
    error: schemaError,
  } = useProviderSchema<Notification>(NOTIFICATIONS_PATH);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('AddConnection')}</ModalHeader>

      <ModalBody>
        {isSchemaFetching ? <LoadingIndicator /> : null}

        {!isSchemaFetching && !!schemaError ? (
          <Alert kind={kinds.DANGER}>{translate('AddNotificationError')}</Alert>
        ) : null}

        {isSchemaPopulated && !schemaError ? (
          <div>
            <div className={styles.notifications}>
              {schema.map((notification) => {
                return (
                  <AddNotificationItem
                    key={notification.implementation}
                    notification={notification}
                    onNotificationSelect={onNotificationSelect}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default AddNotificationModalContent;
