import React, { useCallback, useMemo, useState } from 'react';
import { Filter } from 'App/State/AppState';
import * as commandNames from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import FilterMenu from 'Components/Menu/FilterMenu';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TableOptionsModalWrapper from 'Components/Table/TableOptions/TableOptionsModalWrapper';
import TablePager from 'Components/Table/TablePager';
import useSelectState from 'Helpers/Hooks/useSelectState';
import { align, icons, kinds } from 'Helpers/Props';
import InteractiveImportModal from 'InteractiveImport/InteractiveImportModal';
import { CheckInputChanged } from 'typings/inputs';
import { SelectStateInputProps } from 'typings/props';
import getFilterValue from 'Utilities/Filter/getFilterValue';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import MissingRow from './MissingRow';
import { useMissing, useToggleMonitoredMissingMovies } from './useMissing';

function getMonitoredValue(
  filters: Filter[],
  selectedFilterKey: string | number
): boolean {
  return !!getFilterValue(filters, selectedFilterKey, 'monitored', false);
}

function Missing() {
  const {
    isFetching,
    isPopulated,
    error,
    items,
    columns,
    selectedFilterKey,
    filters,
    sortKey,
    sortDirection,
    page,
    pageSize,
    totalPages,
    totalRecords,
    refetch,
    handleFirstPagePress,
    handlePreviousPagePress,
    handleNextPagePress,
    handleLastPagePress,
    handlePageSelect,
    handleFilterSelect,
    handleSortPress,
    handleTableOptionChange,
  } = useMissing();

  const { toggleMonitored, isSaving } = useToggleMonitoredMissingMovies();

  const isSearchingForAllMovies = useCommandExecuting(
    commandNames.MISSING_MOVIES_SEARCH
  );
  const isSearchingForSelectedMovies = useCommandExecuting(
    commandNames.MOVIE_SEARCH
  );

  const [selectState, setSelectState] = useSelectState();
  const { allSelected, allUnselected, selectedState } = selectState;

  const [isConfirmSearchAllModalOpen, setIsConfirmSearchAllModalOpen] =
    useState(false);

  const [isInteractiveImportModalOpen, setIsInteractiveImportModalOpen] =
    useState(false);

  const selectedIds = useMemo(() => {
    return getSelectedIds(selectedState);
  }, [selectedState]);

  const itemsSelected = !!selectedIds.length;
  const isShowingMonitored = getMonitoredValue(filters, selectedFilterKey);
  const isSearchingForMovies =
    isSearchingForAllMovies || isSearchingForSelectedMovies;

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

  const handleSearchSelectedPress = useCallback(() => {
    executeCommand({
      name: commandNames.MOVIE_SEARCH,
      movieIds: selectedIds,
      commandFinished: () => {
        refetch();
      },
    });
  }, [selectedIds, refetch]);

  const handleSearchAllPress = useCallback(() => {
    setIsConfirmSearchAllModalOpen(true);
  }, []);

  const handleConfirmSearchAllMissingModalClose = useCallback(() => {
    setIsConfirmSearchAllModalOpen(false);
  }, []);

  const handleSearchAllMissingConfirmed = useCallback(() => {
    executeCommand({
      name: commandNames.MISSING_MOVIES_SEARCH,
      commandFinished: () => {
        refetch();
      },
    });

    setIsConfirmSearchAllModalOpen(false);
  }, [refetch]);

  const handleToggleSelectedPress = useCallback(() => {
    toggleMonitored(selectedIds, !isShowingMonitored);
  }, [isShowingMonitored, selectedIds, toggleMonitored]);

  const handleInteractiveImportPress = useCallback(() => {
    setIsInteractiveImportModalOpen(true);
  }, []);

  const handleInteractiveImportModalClose = useCallback(() => {
    setIsInteractiveImportModalOpen(false);
  }, []);

  return (
    <PageContent title={translate('Missing')}>
      <PageToolbar>
        <PageToolbarSection>
          <PageToolbarButton
            label={
              itemsSelected
                ? translate('SearchSelected')
                : translate('SearchAll')
            }
            iconName={icons.SEARCH}
            isDisabled={isSearchingForMovies}
            isSpinning={isSearchingForMovies}
            onPress={
              itemsSelected ? handleSearchSelectedPress : handleSearchAllPress
            }
          />

          <PageToolbarSeparator />

          <PageToolbarButton
            label={
              isShowingMonitored
                ? translate('UnmonitorSelected')
                : translate('MonitorSelected')
            }
            iconName={icons.MONITORED}
            isDisabled={!itemsSelected}
            isSpinning={isSaving}
            onPress={handleToggleSelectedPress}
          />

          <PageToolbarSeparator />

          <PageToolbarButton
            label={translate('ManualImport')}
            iconName={icons.INTERACTIVE}
            onPress={handleInteractiveImportPress}
          />
        </PageToolbarSection>

        <PageToolbarSection alignContent={align.RIGHT}>
          <TableOptionsModalWrapper
            columns={columns}
            pageSize={pageSize}
            onTableOptionChange={handleTableOptionChange}
          >
            <PageToolbarButton
              label={translate('Options')}
              iconName={icons.TABLE}
            />
          </TableOptionsModalWrapper>

          <FilterMenu
            alignMenu={align.RIGHT}
            selectedFilterKey={selectedFilterKey}
            filters={filters}
            customFilters={[]}
            onFilterSelect={handleFilterSelect}
          />
        </PageToolbarSection>
      </PageToolbar>

      <PageContentBody>
        {isFetching && !isPopulated ? <LoadingIndicator /> : null}

        {!isFetching && error ? (
          <Alert kind={kinds.DANGER}>{translate('MissingLoadError')}</Alert>
        ) : null}

        {isPopulated && !error && !items.length ? (
          <Alert kind={kinds.INFO}>{translate('MissingNoItems')}</Alert>
        ) : null}

        {isPopulated && !error && !!items.length ? (
          <div>
            <Table
              selectAll={true}
              allSelected={allSelected}
              allUnselected={allUnselected}
              columns={columns}
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
                    <MissingRow
                      key={item.id}
                      isSelected={selectedState[item.id]}
                      columns={columns}
                      {...item}
                      onSelectedChange={handleSelectedChange}
                    />
                  );
                })}
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

            <ConfirmModal
              isOpen={isConfirmSearchAllModalOpen}
              kind={kinds.DANGER}
              title={translate('SearchForAllMissingMovies')}
              message={
                <div>
                  <div>
                    {translate('SearchForAllMissingMoviesConfirmationCount', {
                      totalRecords,
                    })}
                  </div>
                  <div>{translate('MassSearchCancelWarning')}</div>
                </div>
              }
              confirmLabel={translate('Search')}
              onConfirm={handleSearchAllMissingConfirmed}
              onCancel={handleConfirmSearchAllMissingModalClose}
            />
          </div>
        ) : null}
      </PageContentBody>

      <InteractiveImportModal
        isOpen={isInteractiveImportModalOpen}
        onModalClose={handleInteractiveImportModalClose}
      />
    </PageContent>
  );
}

export default Missing;
