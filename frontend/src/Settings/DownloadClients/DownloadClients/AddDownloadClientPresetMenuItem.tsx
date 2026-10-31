import React, { useCallback } from 'react';
import MenuItem, { MenuItemProps } from 'Components/Menu/MenuItem';
import DownloadClient from 'typings/DownloadClient';
import { getNewDownloadClient } from '../useDownloadClients';

interface AddDownloadClientPresetMenuItemProps
  extends Omit<MenuItemProps, 'children' | 'onPress'> {
  name: string;
  downloadClient: DownloadClient;
  onPress: (downloadClient: DownloadClient) => void;
}

function AddDownloadClientPresetMenuItem({
  name,
  downloadClient,
  onPress,
  ...otherProps
}: AddDownloadClientPresetMenuItemProps) {
  const handlePress = useCallback(() => {
    onPress(getNewDownloadClient(downloadClient, name));
  }, [name, downloadClient, onPress]);

  return (
    <MenuItem {...otherProps} onPress={handlePress}>
      {name}
    </MenuItem>
  );
}

export default AddDownloadClientPresetMenuItem;
