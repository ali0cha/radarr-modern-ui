import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TagList from 'Components/TagList';
import { icons, kinds } from 'Helpers/Props';
import { useDeleteProvider } from 'Settings/useProviderSettings';
import useTags from 'Tags/useTags';
import ImportListModel from 'typings/ImportList';
import formatShortTimeSpan from 'Utilities/Date/formatShortTimeSpan';
import translate from 'Utilities/String/translate';
import { IMPORT_LISTS_PATH } from '../useImportLists';
import EditImportListModal from './EditImportListModal';
import styles from './ImportList.module.css';

interface ImportListProps {
  id: number;
  name: string;
  enabled: boolean;
  enableAuto: boolean;
  tags: number[];
  minRefreshInterval: string;
  onCloneImportListPress: (id: number) => void;
}

function ImportList({
  id,
  name,
  enabled,
  enableAuto,
  tags,
  minRefreshInterval,
  onCloneImportListPress,
}: ImportListProps) {
  const { deleteProvider } = useDeleteProvider<ImportListModel>(
    id,
    IMPORT_LISTS_PATH
  );
  const tagList = useTags();

  const [isEditImportListModalOpen, setIsEditImportListModalOpen] =
    useState(false);

  const [isDeleteImportListModalOpen, setIsDeleteImportListModalOpen] =
    useState(false);

  const handleEditImportListPress = useCallback(() => {
    setIsEditImportListModalOpen(true);
  }, []);

  const handleEditImportListModalClose = useCallback(() => {
    setIsEditImportListModalOpen(false);
  }, []);

  const handleDeleteImportListPress = useCallback(() => {
    setIsEditImportListModalOpen(false);
    setIsDeleteImportListModalOpen(true);
  }, []);

  const handleDeleteImportListModalClose = useCallback(() => {
    setIsDeleteImportListModalOpen(false);
  }, []);

  const handleConfirmDeleteImportList = useCallback(() => {
    deleteProvider();
  }, [deleteProvider]);

  const handleCloneImportListPress = useCallback(() => {
    onCloneImportListPress(id);
  }, [id, onCloneImportListPress]);

  return (
    <Card
      className={styles.list}
      overlayContent={true}
      onPress={handleEditImportListPress}
    >
      <div className={styles.nameContainer}>
        <div className={styles.name}>{name}</div>

        <IconButton
          className={styles.cloneButton}
          title={translate('CloneImportList')}
          name={icons.CLONE}
          onPress={handleCloneImportListPress}
        />
      </div>

      <div className={styles.enabled}>
        {enabled ? (
          <Label kind={kinds.SUCCESS}>{translate('Enabled')}</Label>
        ) : (
          <Label kind={kinds.DISABLED} outline={true}>
            {translate('Disabled')}
          </Label>
        )}

        {enableAuto ? (
          <Label kind={kinds.SUCCESS}>{translate('AutomaticAdd')}</Label>
        ) : null}
      </div>

      <TagList tags={tags} tagList={tagList} />

      <div className={styles.enabled}>
        <Label kind={kinds.DEFAULT} title={translate('ListRefreshInterval')}>
          {`${translate('Refresh')}: ${formatShortTimeSpan(
            minRefreshInterval
          )}`}
        </Label>
      </div>

      <EditImportListModal
        id={id}
        isOpen={isEditImportListModalOpen}
        onModalClose={handleEditImportListModalClose}
        onDeleteImportListPress={handleDeleteImportListPress}
      />

      <ConfirmModal
        isOpen={isDeleteImportListModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteImportList')}
        message={translate('DeleteImportListMessageText', { name })}
        confirmLabel={translate('Delete')}
        onConfirm={handleConfirmDeleteImportList}
        onCancel={handleDeleteImportListModalClose}
      />
    </Card>
  );
}

export default ImportList;
