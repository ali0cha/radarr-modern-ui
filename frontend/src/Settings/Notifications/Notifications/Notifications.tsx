import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import NotificationModel from 'typings/Notification';
import translate from 'Utilities/String/translate';
import { useNotifications } from '../useNotifications';
import AddNotificationModal from './AddNotificationModal';
import EditNotificationModal from './EditNotificationModal';
import Notification from './Notification';
import styles from './Notifications.module.css';

function Notifications() {
  const { items, isFetching, isPopulated, error } = useNotifications();

  const [isAddNotificationModalOpen, setIsAddNotificationModalOpen] =
    useState(false);
  const [isEditNotificationModalOpen, setIsEditNotificationModalOpen] =
    useState(false);

  // The download client that is edited when it is new: a chosen implementation
  const [newNotification, setNewNotification] = useState<
    NotificationModel | undefined
  >();

  const handleAddNotificationPress = useCallback(() => {
    setIsAddNotificationModalOpen(true);
  }, []);

  const handleNotificationSelect = useCallback(
    (notification: NotificationModel) => {
      setNewNotification(notification);
      setIsAddNotificationModalOpen(false);
      setIsEditNotificationModalOpen(true);
    },
    []
  );

  const handleAddNotificationModalClose = useCallback(() => {
    setIsAddNotificationModalOpen(false);
  }, []);

  const handleEditNotificationModalClose = useCallback(() => {
    setIsEditNotificationModalOpen(false);
  }, []);

  return (
    <FieldSet legend={translate('Connections')}>
      <PageSectionContent
        errorMessage={translate('NotificationsLoadError')}
        error={error ?? undefined}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.notifications}>
          {items.map((item) => {
            return <Notification key={item.id} {...item} />;
          })}

          <Card
            className={styles.addNotification}
            onPress={handleAddNotificationPress}
          >
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>
        </div>

        <AddNotificationModal
          isOpen={isAddNotificationModalOpen}
          onNotificationSelect={handleNotificationSelect}
          onModalClose={handleAddNotificationModalClose}
        />

        <EditNotificationModal
          isOpen={isEditNotificationModalOpen}
          defaultNotification={newNotification}
          onModalClose={handleEditNotificationModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default Notifications;
