import React, { useCallback } from 'react';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableSelectCell from 'Components/Table/Cells/TableSelectCell';
import TableRow from 'Components/Table/TableRow';
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';
import { icons, kinds } from 'Helpers/Props';
import { useDeleteProvider } from 'Settings/useProviderSettings';
import ImportListExclusion from 'typings/ImportListExclusion';
import { SelectStateInputProps } from 'typings/props';
import translate from 'Utilities/String/translate';
import EditImportListExclusionModal from './EditImportListExclusionModal';
import {
  IMPORT_LIST_EXCLUSIONS_PATH,
  useInvalidateImportListExclusions,
} from './useImportListExclusions';
import styles from './ImportListExclusionRow.module.css';

interface ImportListExclusionRowProps extends ImportListExclusion {
  isSelected: boolean;
  onSelectedChange: (options: SelectStateInputProps) => void;
}

function ImportListExclusionRow(props: ImportListExclusionRowProps) {
  const { id, tmdbId, movieTitle, movieYear, isSelected, onSelectedChange } =
    props;

  const invalidateExclusions = useInvalidateImportListExclusions();

  const { deleteProvider } = useDeleteProvider<ImportListExclusion>(
    id,
    IMPORT_LIST_EXCLUSIONS_PATH,
    invalidateExclusions
  );

  const [
    isEditImportListExclusionModalOpen,
    setEditImportListExclusionModalOpen,
    setEditImportListExclusionModalClosed,
  ] = useModalOpenState(false);

  const [
    isDeleteImportListExclusionModalOpen,
    setDeleteImportListExclusionModalOpen,
    setDeleteImportListExclusionModalClosed,
  ] = useModalOpenState(false);

  const handleDeletePress = useCallback(() => {
    deleteProvider();
  }, [deleteProvider]);

  return (
    <TableRow>
      <TableSelectCell
        id={id}
        isSelected={isSelected}
        onSelectedChange={onSelectedChange}
      />

      <TableRowCell>{tmdbId}</TableRowCell>
      <TableRowCell>{movieTitle}</TableRowCell>
      <TableRowCell>{movieYear}</TableRowCell>

      <TableRowCell className={styles.actions}>
        <IconButton
          name={icons.EDIT}
          onPress={setEditImportListExclusionModalOpen}
        />
      </TableRowCell>

      <EditImportListExclusionModal
        id={id}
        isOpen={isEditImportListExclusionModalOpen}
        onModalClose={setEditImportListExclusionModalClosed}
        onDeleteImportListExclusionPress={setDeleteImportListExclusionModalOpen}
      />

      <ConfirmModal
        isOpen={isDeleteImportListExclusionModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteImportListExclusion')}
        message={translate('DeleteImportListExclusionMessageText')}
        confirmLabel={translate('Delete')}
        onConfirm={handleDeletePress}
        onCancel={setDeleteImportListExclusionModalClosed}
      />
    </TableRow>
  );
}

export default ImportListExclusionRow;
