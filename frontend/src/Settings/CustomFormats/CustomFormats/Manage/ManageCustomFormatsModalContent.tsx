import React, { useCallback, useMemo, useState } from 'react';
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import SpinnerButton from 'Components/Link/SpinnerButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Column from 'Components/Table/Column';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import { useClientSideSort } from 'Helpers/Hooks/useClientSideSort';
import useSelectState from 'Helpers/Hooks/useSelectState';
import { kinds } from 'Helpers/Props';
import {
  useBulkDeleteProviders,
  useBulkEditProviders,
} from 'Settings/useProviderSettings';
import CustomFormat from 'typings/CustomFormat';
import { CheckInputChanged } from 'typings/inputs';
import getErrorMessage from 'Utilities/Object/getErrorMessage';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import { CUSTOM_FORMATS_PATH, useCustomFormats } from '../../useCustomFormats';
import ManageCustomFormatsEditModal from './Edit/ManageCustomFormatsEditModal';
import ManageCustomFormatsModalRow from './ManageCustomFormatsModalRow';
import styles from './ManageCustomFormatsModalContent.module.css';

// TODO: This feels janky to do, but not sure of a better way currently
type OnSelectedChangeCallback = React.ComponentProps<
  typeof ManageCustomFormatsModalRow
>['onSelectedChange'];

const COLUMNS: Column[] = [
  {
    name: 'name',
    label: () => translate('Name'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'includeCustomFormatWhenRenaming',
    label: () => translate('IncludeCustomFormatWhenRenaming'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'actions',
    label: '',
    isVisible: true,
  },
];

interface ManageCustomFormatsModalContentProps {
  onModalClose(): void;
}

const sortPredicates = {
  name: ({ name }: CustomFormat) => name.toLocaleLowerCase(),
};

function ManageCustomFormatsModalContent(
  props: ManageCustomFormatsModalContentProps
) {
  const { onModalClose } = props;

  const {
    items: customFormats,
    isFetching: isFetchingCustomFormats,
    isPopulated,
    error,
  } = useCustomFormats();

  // The table must stay while the custom formats are refreshed in the
  // background: its rows unselect their item when they go away.
  const isFetching = isFetchingCustomFormats && !isPopulated;

  const { items, sortKey, sortDirection, onSortPress } = useClientSideSort(
    customFormats,
    { sortKey: 'name', sortDirection: 'ascending', predicates: sortPredicates }
  );

  const { bulkDelete, isBulkDeleting: isDeleting } =
    useBulkDeleteProviders<CustomFormat>(CUSTOM_FORMATS_PATH);

  const { bulkEdit, isBulkEditing: isSaving } = useBulkEditProviders<
    CustomFormat,
    object
  >(CUSTOM_FORMATS_PATH);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectState, setSelectState] = useSelectState();

  const { allSelected, allUnselected, selectedState } = selectState;

  const selectedIds: number[] = useMemo(() => {
    return getSelectedIds(selectedState);
  }, [selectedState]);

  const selectedCount = selectedIds.length;

  const onDeletePress = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, [setIsDeleteModalOpen]);

  const onDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, [setIsDeleteModalOpen]);

  const onEditPress = useCallback(() => {
    setIsEditModalOpen(true);
  }, [setIsEditModalOpen]);

  const onEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, [setIsEditModalOpen]);

  const onConfirmDelete = useCallback(() => {
    bulkDelete({ ids: selectedIds });
    setIsDeleteModalOpen(false);
  }, [selectedIds, bulkDelete]);

  const onSavePress = useCallback(
    (payload: object) => {
      setIsEditModalOpen(false);

      bulkEdit({
        ids: selectedIds,
        ...payload,
      });
    },
    [selectedIds, bulkEdit]
  );

  const onSelectAllChange = useCallback(
    ({ value }: CheckInputChanged) => {
      setSelectState({ type: value ? 'selectAll' : 'unselectAll', items });
    },
    [items, setSelectState]
  );

  const onSelectedChange = useCallback<OnSelectedChangeCallback>(
    ({ id, value, shiftKey = false }) => {
      setSelectState({
        type: 'toggleSelected',
        items,
        id,
        isSelected: value,
        shiftKey,
      });
    },
    [items, setSelectState]
  );

  const errorMessage = getErrorMessage(error, 'Unable to load custom formats.');
  const anySelected = selectedCount > 0;

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('ManageCustomFormats')}</ModalHeader>
      <ModalBody>
        {isFetching ? <LoadingIndicator /> : null}

        {error ? <div>{errorMessage}</div> : null}

        {isPopulated && !error && !items.length ? (
          <Alert kind={kinds.INFO}>{translate('NoCustomFormatsFound')}</Alert>
        ) : null}

        {isPopulated && !!items.length && !isFetching && !isFetching ? (
          <Table
            columns={COLUMNS}
            horizontalScroll={true}
            selectAll={true}
            allSelected={allSelected}
            allUnselected={allUnselected}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSelectAllChange={onSelectAllChange}
            onSortPress={onSortPress}
          >
            <TableBody>
              {items.map((item) => {
                return (
                  <ManageCustomFormatsModalRow
                    key={item.id}
                    isSelected={selectedState[item.id]}
                    {...item}
                    columns={COLUMNS}
                    onSelectedChange={onSelectedChange}
                  />
                );
              })}
            </TableBody>
          </Table>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <div className={styles.leftButtons}>
          <SpinnerButton
            kind={kinds.DANGER}
            isSpinning={isDeleting}
            isDisabled={!anySelected}
            onPress={onDeletePress}
          >
            {translate('Delete')}
          </SpinnerButton>

          <SpinnerButton
            isSpinning={isSaving}
            isDisabled={!anySelected}
            onPress={onEditPress}
          >
            {translate('Edit')}
          </SpinnerButton>
        </div>

        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>

      <ManageCustomFormatsEditModal
        isOpen={isEditModalOpen}
        customFormatIds={selectedIds}
        onModalClose={onEditModalClose}
        onSavePress={onSavePress}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteSelectedCustomFormats')}
        message={translate('DeleteSelectedCustomFormatsMessageText', {
          count: selectedIds.length,
        })}
        confirmLabel={translate('Delete')}
        onConfirm={onConfirmDelete}
        onCancel={onDeleteModalClose}
      />
    </ModalContent>
  );
}

export default ManageCustomFormatsModalContent;
