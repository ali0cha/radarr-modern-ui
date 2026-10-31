import React, { useCallback } from 'react';
import MenuItem, { MenuItemProps } from 'Components/Menu/MenuItem';
import Notification from 'typings/Notification';
import { getNewNotification } from '../useNotifications';

interface AddNotificationPresetMenuItemProps
  extends Omit<MenuItemProps, 'children' | 'onPress'> {
  name: string;
  notification: Notification;
  onPress: (notification: Notification) => void;
}

function AddNotificationPresetMenuItem({
  name,
  notification,
  onPress,
  ...otherProps
}: AddNotificationPresetMenuItemProps) {
  const handlePress = useCallback(() => {
    onPress(getNewNotification(notification, name));
  }, [name, notification, onPress]);

  return (
    <MenuItem {...otherProps} onPress={handlePress}>
      {name}
    </MenuItem>
  );
}

export default AddNotificationPresetMenuItem;
