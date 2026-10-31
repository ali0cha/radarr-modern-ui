import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import { usePrefetchRootFolders } from 'RootFolder/useRootFolders';
import ImportListModel from 'typings/ImportList';
import translate from 'Utilities/String/translate';
import { getClonedImportList, useImportLists } from '../useImportLists';
import AddImportListModal from './AddImportListModal';
import EditImportListModal from './EditImportListModal';
import ImportList from './ImportList';
import styles from './ImportLists.module.css';

function ImportLists() {
  usePrefetchRootFolders();

  const { items, isFetching, isPopulated, error } = useImportLists();

  const [isAddImportListModalOpen, setIsAddImportListModalOpen] =
    useState(false);
  const [isEditImportListModalOpen, setIsEditImportListModalOpen] =
    useState(false);

  // The import list that is edited when it is new: a chosen implementation or a clone
  const [newImportList, setNewImportList] = useState<
    ImportListModel | undefined
  >();

  const handleAddImportListPress = useCallback(() => {
    setIsAddImportListModalOpen(true);
  }, []);

  const handleAddImportListModalClose = useCallback(() => {
    setIsAddImportListModalOpen(false);
  }, []);

  const handleImportListSelect = useCallback((importList: ImportListModel) => {
    setNewImportList(importList);
    setIsAddImportListModalOpen(false);
    setIsEditImportListModalOpen(true);
  }, []);

  const handleEditImportListModalClose = useCallback(() => {
    setIsEditImportListModalOpen(false);
  }, []);

  const handleCloneImportListPress = useCallback(
    (id: number) => {
      const importList = items.find((item) => item.id === id);

      if (importList) {
        setNewImportList(getClonedImportList(importList));
        setIsEditImportListModalOpen(true);
      }
    },
    [items]
  );

  return (
    <FieldSet legend={translate('ImportLists')}>
      <PageSectionContent
        errorMessage={translate('ImportListsLoadError')}
        error={error ?? undefined}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.lists}>
          {items.map((item) => {
            return (
              <ImportList
                key={item.id}
                {...item}
                onCloneImportListPress={handleCloneImportListPress}
              />
            );
          })}

          <Card className={styles.addList} onPress={handleAddImportListPress}>
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>
        </div>

        <AddImportListModal
          isOpen={isAddImportListModalOpen}
          onImportListSelect={handleImportListSelect}
          onModalClose={handleAddImportListModalClose}
        />

        <EditImportListModal
          isOpen={isEditImportListModalOpen}
          defaultImportList={newImportList}
          onModalClose={handleEditImportListModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default ImportLists;
