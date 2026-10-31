import React, { useCallback } from 'react';
import MenuItem, { MenuItemProps } from 'Components/Menu/MenuItem';
import ImportList from 'typings/ImportList';
import { getNewImportList } from '../useImportLists';

interface AddImportListPresetMenuItemProps
  extends Omit<MenuItemProps, 'children' | 'onPress'> {
  name: string;
  importList: ImportList;
  onPress: (importList: ImportList) => void;
}

function AddImportListPresetMenuItem({
  name,
  importList,
  onPress,
  ...otherProps
}: AddImportListPresetMenuItemProps) {
  const handlePress = useCallback(() => {
    onPress(getNewImportList(importList, name));
  }, [name, importList, onPress]);

  return (
    <MenuItem {...otherProps} onPress={handlePress}>
      {name}
    </MenuItem>
  );
}

export default AddImportListPresetMenuItem;
