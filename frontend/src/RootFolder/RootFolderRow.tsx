import React, { useCallback, useState } from 'react';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import { icons, kinds } from 'Helpers/Props';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import { useDeleteRootFolder } from './useRootFolders';
import styles from './RootFolderRow.module.css';

interface RootFolderRowProps {
  id: number;
  path: string;
  accessible: boolean;
  freeSpace?: number;
  unmappedFolders: object[];
}

function RootFolderRow(props: RootFolderRowProps) {
  const { id, path, accessible, freeSpace = 0, unmappedFolders = [] } = props;

  const isUnavailable = !accessible;

  const { mutate: deleteRootFolder } = useDeleteRootFolder();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onDeletePress = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, [setIsDeleteModalOpen]);

  const onDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, [setIsDeleteModalOpen]);

  const onConfirmDelete = useCallback(() => {
    deleteRootFolder({ id });

    setIsDeleteModalOpen(false);
  }, [deleteRootFolder, id]);

  return (
    <TableRow>
      <TableRowCell>
        {isUnavailable ? (
          <div className={styles.unavailablePath}>
            {path}

            <Label className={styles.unavailableLabel} kind={kinds.DANGER}>
              {translate('Unavailable')}
            </Label>
          </div>
        ) : (
          <Link className={styles.link} to={`/add/import/${id}`}>
            {path}
          </Link>
        )}
      </TableRowCell>

      <TableRowCell className={styles.freeSpace}>
        {isUnavailable || isNaN(Number(freeSpace))
          ? '-'
          : formatBytes(freeSpace)}
      </TableRowCell>

      <TableRowCell className={styles.unmappedFolders}>
        {isUnavailable ? '-' : unmappedFolders.length}
      </TableRowCell>

      <TableRowCell className={styles.actions}>
        <IconButton
          title={translate('RemoveRootFolder')}
          name={icons.REMOVE}
          onPress={onDeletePress}
        />
      </TableRowCell>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        kind={kinds.DANGER}
        title={translate('RemoveRootFolder')}
        message={translate('RemoveRootFolderMoviesMessageText', { path })}
        confirmLabel={translate('Remove')}
        onConfirm={onConfirmDelete}
        onCancel={onDeleteModalClose}
      />
    </TableRow>
  );
}

export default RootFolderRow;
