import React, { useCallback } from 'react';
import Button from 'Components/Link/Button';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import { sizes } from 'Helpers/Props';
import Notification from 'typings/Notification';
import translate from 'Utilities/String/translate';
import { getNewNotification } from '../useNotifications';
import AddNotificationPresetMenuItem from './AddNotificationPresetMenuItem';
import styles from './AddNotificationItem.module.css';

interface AddNotificationItemProps {
  notification: Notification & { presets?: Notification[] };
  onNotificationSelect: (notification: Notification) => void;
}

function AddNotificationItem({
  notification,
  onNotificationSelect,
}: AddNotificationItemProps) {
  const { implementationName, infoLink, presets } = notification;
  const hasPresets = !!presets && !!presets.length;

  const handleNotificationSelect = useCallback(() => {
    onNotificationSelect(getNewNotification(notification));
  }, [notification, onNotificationSelect]);

  return (
    <div className={styles.notification}>
      <Link className={styles.underlay} onPress={handleNotificationSelect} />

      <div className={styles.overlay}>
        <div className={styles.name}>{implementationName}</div>

        <div className={styles.actions}>
          {hasPresets && (
            <span>
              <Button size={sizes.SMALL} onPress={handleNotificationSelect}>
                {translate('Custom')}
              </Button>

              <Menu className={styles.presetsMenu}>
                <Button className={styles.presetsMenuButton} size={sizes.SMALL}>
                  {translate('Presets')}
                </Button>

                <MenuContent>
                  {presets.map((preset) => {
                    return (
                      <AddNotificationPresetMenuItem
                        key={preset.name}
                        name={preset.name}
                        notification={notification}
                        onPress={onNotificationSelect}
                      />
                    );
                  })}
                </MenuContent>
              </Menu>
            </span>
          )}

          <Button to={infoLink} size={sizes.SMALL}>
            {translate('MoreInfo')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddNotificationItem;
