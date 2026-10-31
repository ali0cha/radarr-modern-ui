import React, { useCallback, useMemo, useState } from 'react';
import FieldSet from 'Components/FieldSet';
import IconButton from 'Components/Link/IconButton';
import SpinnerButton from 'Components/Link/SpinnerButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import PageSectionContent from 'Components/Page/PageSectionContent';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import Column from 'Components/Table/Column';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TablePager from 'Components/Table/TablePager';
import TableRow from 'Components/Table/TableRow';
import {
  usePagerHandlers,
  usePageState,
} from 'Components/Table/usePageNavigation';
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';
import useSelectState from 'Helpers/Hooks/useSelectState';
import { icons, kinds } from 'Helpers/Props';
import { useBulkDeleteProviders } from 'Settings/useProviderSettings';
import ImportListExclusion from 'typings/ImportListExclusion';
import { CheckInputChanged } from 'typings/inputs';
import { SelectStateInputProps } from 'typings/props';
import { TableOptionsChangePayload } from 'typings/Table';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import EditImportListExclusionModal from './EditImportListExclusionModal';
import ImportListExclusionRow from './ImportListExclusionRow';
import {
  IMPORT_LIST_EXCLUSIONS_PATH,
  setImportListExclusionsPageSize,
  useImportListExclusions,
  useInvalidateImportListExclusions,
} from './useImportListExclusions';
import styles from './ImportListExclusions.module.css';

const COLUMNS: Column[] = [
  {
    name: 'tmdbId',
    label: () => translate('TMDBId'),
    isVisible: true,
    isSortable: true,
  },
  {
    name: 'movieTitle',
    label: () => translate('Title'),
    isVisible: true,
    isSortable: true,
  },
  {
    name: 'movieYear',
    label: () => translate('Year'),
    isVisible: true,
    isSortable: true,
  },
  {
    className: styles.actions,
    name: 'actions',
    label: '',
    isVisible: true,
    isSortable: false,
  },
];

function ImportListExclusions() {
  const { page, setPage } = usePageState();

  const {
    items,
    pageSize,
    sortKey,
    sortDirection,
    totalPages,
    totalRecords,
    isFetching,
    isPopulated,
    error,
    handleSortPress,
  } = useImportListExclusions(page);

  const {
    handleFirstPagePress,
    handlePreviousPagePress,
    handleNextPagePress,
    handleLastPagePress,
    handlePageSelect,
  } = usePagerHandlers({ page, totalPages, setPage });

  const invalidateExclusions = useInvalidateImportListExclusions();

  const { bulkDelete, isBulkDeleting: isDeleting } =
    useBulkDeleteProviders<ImportListExclusion>(IMPORT_LIST_EXCLUSIONS_PATH);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const [selectState, setSelectState] = useSelectState();
  const { allSelected, allUnselected, selectedState } = selectState;

  const selectedIds = useMemo(() => {
    return getSelectedIds(selectedState);
  }, [selectedState]);

  const handleSelectAllChange = useCallback(
    ({ value }: CheckInputChanged) => {
      setSelectState({ type: value ? 'selectAll' : 'unselectAll', items });
    },
    [items, setSelectState]
  );

  const handleSelectedChange = useCallback(
    ({ id, value, shiftKey = false }: SelectStateInputProps) => {
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

  const handleDeleteSelectedPress = useCallback(() => {
    setIsConfirmDeleteModalOpen(true);
  }, []);

  const handleDeleteSelectedConfirmed = useCallback(() => {
    bulkDelete(
      { ids: selectedIds },
      {
        onSuccess: () => {
          setSelectState({ type: 'unselectAll', items });
          invalidateExclusions();
        },
      }
    );

    setIsConfirmDeleteModalOpen(false);
  }, [selectedIds, items, bulkDelete, setSelectState, invalidateExclusions]);

  const handleConfirmDeleteModalClose = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
  }, []);

  const handleTableOptionChange = useCallback(
    (payload: TableOptionsChangePayload) => {
      if (payload.pageSize) {
        setImportListExclusionsPageSize(payload.pageSize);
        setPage(1);
      }
    },
    [setPage]
  );

  const [
    isAddImportListExclusionModalOpen,
    setAddImportListExclusionModalOpen,
    setAddImportListExclusionModalClosed,
  ] = useModalOpenState(false);

  const isFetchingForFirstTime = isFetching && !isPopulated;

  return (
    <FieldSet legend={translate('ImportListExclusions')}>
      <PageSectionContent
        errorMessage={translate('ImportListExclusionsLoadError')}
        isFetching={isFetchingForFirstTime}
        isPopulated={isPopulated}
        error={error ?? undefined}
      >
        <Table
          selectAll={true}
          allSelected={allSelected}
          allUnselected={allUnselected}
          columns={COLUMNS}
          canModifyColumns={false}
          pageSize={pageSize}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onTableOptionChange={handleTableOptionChange}
          onSelectAllChange={handleSelectAllChange}
          onSortPress={handleSortPress}
        >
          <TableBody>
            {items.map((item) => {
              return (
                <ImportListExclusionRow
                  key={item.id}
                  {...item}
                  isSelected={selectedState[item.id] || false}
                  onSelectedChange={handleSelectedChange}
                />
              );
            })}

            <TableRow>
              <TableRowCell colSpan={4}>
                <SpinnerButton
                  kind={kinds.DANGER}
                  isSpinning={isDeleting}
                  isDisabled={!selectedIds.length}
                  onPress={handleDeleteSelectedPress}
                >
                  {translate('Delete')}
                </SpinnerButton>
              </TableRowCell>

              <TableRowCell>
                <IconButton
                  name={icons.ADD}
                  onPress={setAddImportListExclusionModalOpen}
                />
              </TableRowCell>
            </TableRow>
          </TableBody>
        </Table>

        <TablePager
          page={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          isFetching={isFetching}
          onFirstPagePress={handleFirstPagePress}
          onPreviousPagePress={handlePreviousPagePress}
          onNextPagePress={handleNextPagePress}
          onLastPagePress={handleLastPagePress}
          onPageSelect={handlePageSelect}
        />

        <EditImportListExclusionModal
          isOpen={isAddImportListExclusionModalOpen}
          onModalClose={setAddImportListExclusionModalClosed}
        />

        <ConfirmModal
          isOpen={isConfirmDeleteModalOpen}
          kind={kinds.DANGER}
          title={translate('DeleteSelected')}
          message={translate('DeleteSelectedImportListExclusionsMessageText')}
          confirmLabel={translate('DeleteSelected')}
          onConfirm={handleDeleteSelectedConfirmed}
          onCancel={handleConfirmDeleteModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default ImportListExclusions;
