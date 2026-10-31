import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FileBrowserModal from 'Components/FileBrowser/FileBrowserModal';
import { useAddRootFolder, useRootFolders } from 'RootFolder/useRootFolders';
import { EnhancedSelectInputChanged, InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import EnhancedSelectInput, {
  EnhancedSelectInputProps,
  EnhancedSelectInputValue,
} from './EnhancedSelectInput';
import RootFolderSelectInputOption from './RootFolderSelectInputOption';
import RootFolderSelectInputSelectedValue from './RootFolderSelectInputSelectedValue';

const ADD_NEW_KEY = 'addNew';

export interface RootFolderSelectInputValue
  extends EnhancedSelectInputValue<string> {
  freeSpace?: number;
  isMissing?: boolean;
}

export interface RootFolderSelectInputProps
  extends Omit<
    EnhancedSelectInputProps<EnhancedSelectInputValue<string>, string>,
    'value' | 'values'
  > {
  name: string;
  value?: string;
  includeMissingValue?: boolean;
  includeNoChange?: boolean;
  includeNoChangeDisabled?: boolean;
}

function RootFolderSelectInput({
  name,
  value,
  includeMissingValue = true,
  includeNoChange = false,
  includeNoChangeDisabled = true,
  onChange,
  ...otherProps
}: RootFolderSelectInputProps) {
  const { items } = useRootFolders();
  const { mutate: addRootFolder } = useAddRootFolder();

  const values = useMemo(() => {
    const values: RootFolderSelectInputValue[] = items.map((rootFolder) => {
      return {
        key: rootFolder.path,
        value: rootFolder.path,
        freeSpace: rootFolder.freeSpace,
        isMissing: false,
      };
    });

    if (includeNoChange) {
      values.unshift({
        key: 'noChange',
        get value() {
          return translate('NoChange');
        },
        isDisabled: includeNoChangeDisabled,
        isMissing: false,
      });
    }

    if (!values.length) {
      values.push({
        key: '',
        value: '',
        isDisabled: true,
        isHidden: true,
      });
    }

    if (includeMissingValue && value && !values.find((v) => v.key === value)) {
      values.push({
        key: value,
        value,
        isMissing: true,
        isDisabled: true,
      });
    }

    values.push({
      key: ADD_NEW_KEY,
      value: translate('AddANewPath'),
    });

    return values;
  }, [
    items,
    value,
    includeMissingValue,
    includeNoChange,
    includeNoChangeDisabled,
  ]);

  const [isAddNewRootFolderModalOpen, setIsAddNewRootFolderModalOpen] =
    useState(false);

  const handleChange = useCallback(
    ({ value: newValue }: EnhancedSelectInputChanged<string>) => {
      if (newValue === 'addNew') {
        setIsAddNewRootFolderModalOpen(true);
      } else {
        onChange({ name, value: newValue });
      }
    },
    [name, setIsAddNewRootFolderModalOpen, onChange]
  );

  const handleNewRootFolderSelect = useCallback(
    ({ value: newValue }: InputChanged<string>) => {
      addRootFolder(
        { path: newValue },
        {
          onSuccess: () => {
            onChange({ name, value: newValue });
          },
        }
      );
    },
    [name, addRootFolder, onChange]
  );

  const handleAddRootFolderModalClose = useCallback(() => {
    setIsAddNewRootFolderModalOpen(false);
  }, [setIsAddNewRootFolderModalOpen]);

  useEffect(() => {
    if (
      !value &&
      values.length &&
      values.some((v) => !!v.key && v.key !== ADD_NEW_KEY)
    ) {
      const defaultValue = values[0];

      if (defaultValue.key !== ADD_NEW_KEY) {
        onChange({ name, value: defaultValue.key });
      }
    }
  }, [name, value, values, onChange]);

  useEffect(() => {
    if (value == null && values[0].key === '') {
      onChange({ name, value: '' });
    } else if (
      !value ||
      !values.some((v) => v.key === value) ||
      value === ADD_NEW_KEY
    ) {
      const defaultValue = values[0];

      if (defaultValue.key === ADD_NEW_KEY) {
        onChange({ name, value: '' });
      } else {
        onChange({ name, value: defaultValue.key });
      }
    }

    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <EnhancedSelectInput
        {...otherProps}
        name={name}
        value={value ?? ''}
        values={values}
        selectedValueComponent={RootFolderSelectInputSelectedValue}
        optionComponent={RootFolderSelectInputOption}
        onChange={handleChange}
      />

      <FileBrowserModal
        isOpen={isAddNewRootFolderModalOpen}
        name="rootFolderPath"
        value=""
        onChange={handleNewRootFolderSelect}
        onModalClose={handleAddRootFolderModalClose}
      />
    </>
  );
}

export default RootFolderSelectInput;
