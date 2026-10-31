import React, { useCallback } from 'react';
import MenuItem, { MenuItemProps } from 'Components/Menu/MenuItem';
import { getNewSpecification } from 'Settings/useSpecifications';
import { CustomFormatSpecification } from 'typings/CustomFormat';

interface AddSpecificationPresetMenuItemProps
  extends Omit<MenuItemProps, 'children' | 'onPress'> {
  name: string;
  specification: CustomFormatSpecification;
  onPress: (specification: CustomFormatSpecification) => void;
}

function AddSpecificationPresetMenuItem({
  name,
  specification,
  onPress,
  ...otherProps
}: AddSpecificationPresetMenuItemProps) {
  const handlePress = useCallback(() => {
    onPress(getNewSpecification(specification, name));
  }, [name, specification, onPress]);

  return (
    <MenuItem {...otherProps} onPress={handlePress}>
      {name}
    </MenuItem>
  );
}

export default AddSpecificationPresetMenuItem;
