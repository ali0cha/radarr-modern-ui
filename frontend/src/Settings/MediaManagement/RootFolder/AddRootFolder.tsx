import React, { useCallback, useState } from 'react';
import FileBrowserModal from 'Components/FileBrowser/FileBrowserModal';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import { icons, kinds, sizes } from 'Helpers/Props';
import AddRootFolderError from 'RootFolder/AddRootFolderError';
import { useAddRootFolder } from 'RootFolder/useRootFolders';
import translate from 'Utilities/String/translate';
import styles from './AddRootFolder.module.css';

function AddRootFolder() {
  const {
    mutate: addRootFolder,
    isPending: isSaving,
    error: saveError,
  } = useAddRootFolder();

  const [isAddNewRootFolderModalOpen, setIsAddNewRootFolderModalOpen] =
    useState(false);

  const onAddNewRootFolderPress = useCallback(() => {
    setIsAddNewRootFolderModalOpen(true);
  }, [setIsAddNewRootFolderModalOpen]);

  const onNewRootFolderSelect = useCallback(
    ({ value }: { value: string }) => {
      addRootFolder({ path: value });
    },
    [addRootFolder]
  );

  const onAddRootFolderModalClose = useCallback(() => {
    setIsAddNewRootFolderModalOpen(false);
  }, [setIsAddNewRootFolderModalOpen]);

  return (
    <>
      {!isSaving && saveError ? <AddRootFolderError error={saveError} /> : null}

      <div className={styles.addRootFolderButtonContainer}>
        <Button
          kind={kinds.PRIMARY}
          size={sizes.LARGE}
          onPress={onAddNewRootFolderPress}
        >
          <Icon className={styles.importButtonIcon} name={icons.DRIVE} />
          {translate('AddRootFolder')}
        </Button>

        <FileBrowserModal
          isOpen={isAddNewRootFolderModalOpen}
          name="rootFolderPath"
          value=""
          onChange={onNewRootFolderSelect}
          onModalClose={onAddRootFolderModalClose}
        />
      </div>
    </>
  );
}

export default AddRootFolder;
