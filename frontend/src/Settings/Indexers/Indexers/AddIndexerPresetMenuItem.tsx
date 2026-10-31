import React, { useCallback } from 'react';
import MenuItem, { MenuItemProps } from 'Components/Menu/MenuItem';
import Indexer from 'typings/Indexer';
import { getNewIndexer } from '../useIndexers';

interface AddIndexerPresetMenuItemProps
  extends Omit<MenuItemProps, 'children' | 'onPress'> {
  name: string;
  indexer: Indexer;
  onPress: (indexer: Indexer) => void;
}

function AddIndexerPresetMenuItem({
  name,
  indexer,
  onPress,
  ...otherProps
}: AddIndexerPresetMenuItemProps) {
  const handlePress = useCallback(() => {
    onPress(getNewIndexer(indexer, name));
  }, [name, indexer, onPress]);

  return (
    <MenuItem {...otherProps} onPress={handlePress}>
      {name}
    </MenuItem>
  );
}

export default AddIndexerPresetMenuItem;
