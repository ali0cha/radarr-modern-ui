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
import Indexer from 'typings/Indexer';
import { CheckInputChanged } from 'typings/inputs';
import getErrorMessage from 'Utilities/Object/getErrorMessage';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import { INDEXERS_PATH, useIndexers } from '../../useIndexers';
import ManageIndexersEditModal from './Edit/ManageIndexersEditModal';
import ManageIndexersModalRow from './ManageIndexersModalRow';
import TagsModal from './Tags/TagsModal';
import styles from './ManageIndexersModalContent.module.css';

// TODO: This feels janky to do, but not sure of a better way currently
type OnSelectedChangeCallback = React.ComponentProps<
  typeof ManageIndexersModalRow
>['onSelectedChange'];

const COLUMNS: Column[] = [
  {
    name: 'name',
    label: () => translate('Name'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'implementation',
    label: () => translate('Implementation'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'enableRss',
    label: () => translate('EnableRss'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'enableAutomaticSearch',
    label: () => translate('EnableAutomaticSearch'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'enableInteractiveSearch',
    label: () => translate('EnableInteractiveSearch'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'priority',
    label: () => translate('Priority'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'tags',
    label: () => translate('Tags'),
    isSortable: true,
    isVisible: true,
  },
];

interface ManageIndexersModalContentProps {
  onModalClose(): void;
}

const sortPredicates = {
  name: ({ name }: Indexer) => name.toLocaleLowerCase(),
};

function ManageIndexersModalContent(props: ManageIndexersModalContentProps) {
  const { onModalClose } = props;

  const {
    items: indexers,
    isFetching: isFetchingIndexers,
    isPopulated,
    error,
  } = useIndexers();

  // The table must stay while the indexers are refreshed in the background:
  // its rows unselect their item when they go away.
  const isFetching = isFetchingIndexers && !isPopulated;

  const { items, sortKey, sortDirection, onSortPress } = useClientSideSort(
    indexers,
    { sortKey: 'name', sortDirection: 'ascending', predicates: sortPredicates }
  );

  const { bulkDelete, isBulkDeleting: isDeleting } =
    useBulkDeleteProviders<Indexer>(INDEXERS_PATH);

  const { bulkEdit, isBulkEditing: isSaving } = useBulkEditProviders<
    Indexer,
    object
  >(INDEXERS_PATH);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isSavingTags, setIsSavingTags] = useState(false);

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

  const onTagsPress = useCallback(() => {
    setIsTagsModalOpen(true);
  }, [setIsTagsModalOpen]);

  const onTagsModalClose = useCallback(() => {
    setIsTagsModalOpen(false);
  }, [setIsTagsModalOpen]);

  const onApplyTagsPress = useCallback(
    (tags: number[], applyTags: string) => {
      setIsSavingTags(true);
      setIsTagsModalOpen(false);

      bulkEdit({
        ids: selectedIds,
        tags,
        applyTags,
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

  const errorMessage = getErrorMessage(error, 'Unable to load indexers.');
  const anySelected = selectedCount > 0;

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('ManageIndexers')}</ModalHeader>
      <ModalBody>
        {isFetching ? <LoadingIndicator /> : null}

        {error ? <div>{errorMessage}</div> : null}

        {isPopulated && !error && !items.length ? (
          <Alert kind={kinds.INFO}>{translate('NoIndexersFound')}</Alert>
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
                  <ManageIndexersModalRow
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

          <SpinnerButton
            isSpinning={isSaving && isSavingTags}
            isDisabled={!anySelected}
            onPress={onTagsPress}
          >
            {translate('SetTags')}
          </SpinnerButton>
        </div>

        <Button onPress={onModalClose}>{translate('Close')}</Button>
      </ModalFooter>

      <ManageIndexersEditModal
        isOpen={isEditModalOpen}
        indexerIds={selectedIds}
        onModalClose={onEditModalClose}
        onSavePress={onSavePress}
      />

      <TagsModal
        isOpen={isTagsModalOpen}
        ids={selectedIds}
        onApplyTagsPress={onApplyTagsPress}
        onModalClose={onTagsModalClose}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteSelectedIndexers')}
        message={translate('DeleteSelectedIndexersMessageText', {
          count: selectedIds.length,
        })}
        confirmLabel={translate('Delete')}
        onConfirm={onConfirmDelete}
        onCancel={onDeleteModalClose}
      />
    </ModalContent>
  );
}

export default ManageIndexersModalContent;
