import React, { useCallback, useEffect } from 'react';
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import FilterMenu from 'Components/Menu/FilterMenu';
import PageMenuButton from 'Components/Menu/PageMenuButton';
import Column from 'Components/Table/Column';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import { align, icons, kinds, sortDirections } from 'Helpers/Props';
import getErrorMessage from 'Utilities/Object/getErrorMessage';
import translate from 'Utilities/String/translate';
import InteractiveSearchFilterModal from './InteractiveSearchFilterModal';
import InteractiveSearchPayload from './InteractiveSearchPayload';
import InteractiveSearchRow from './InteractiveSearchRow';
import { clearGrabStates, grabRelease, useReleases } from './useReleases';
import styles from './InteractiveSearch.module.css';

const columns: Column[] = [
  {
    name: 'protocol',
    label: () => translate('Source'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'age',
    label: () => translate('Age'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'title',
    label: () => translate('Title'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'indexer',
    label: () => translate('Indexer'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'history',
    label: () => translate('History'),
    isSortable: true,
    fixedSortDirection: sortDirections.ASCENDING,
    isVisible: true,
  },
  {
    name: 'size',
    label: () => translate('Size'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'peers',
    label: () => translate('Peers'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'languages',
    label: () => translate('Language'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'qualityWeight',
    label: () => translate('Quality'),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'customFormatScore',
    label: React.createElement(Icon, {
      name: icons.SCORE,
      title: () => translate('CustomFormatScore'),
    }),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'indexerFlags',
    label: React.createElement(Icon, {
      name: icons.FLAG,
      title: () => translate('IndexerFlags'),
    }),
    isSortable: true,
    isVisible: true,
  },
  {
    name: 'rejections',
    label: React.createElement(Icon, {
      name: icons.DANGER,
      title: () => translate('Rejections'),
    }),
    isSortable: true,
    fixedSortDirection: sortDirections.ASCENDING,
    isVisible: true,
  },
  {
    name: 'releaseWeight',
    label: React.createElement(Icon, { name: icons.DOWNLOAD }),
    isSortable: true,
    fixedSortDirection: sortDirections.ASCENDING,
    isVisible: true,
  },
];

interface InteractiveSearchProps {
  searchPayload: InteractiveSearchPayload;
}

function InteractiveSearch({ searchPayload }: InteractiveSearchProps) {
  const {
    isFetching,
    isPopulated,
    error,
    items,
    totalItems,
    selectedFilterKey,
    filters,
    customFilters,
    sortKey,
    sortDirection,
    handleFilterSelect,
    handleSortPress,
  } = useReleases(searchPayload);

  const handleGrabPress = useCallback((payload: { guid: string }) => {
    grabRelease(payload);
  }, []);

  // The grabbing states are forgotten when the releases are not shown any more
  useEffect(() => {
    return () => {
      clearGrabStates();
    };
  }, []);

  const errorMessage = getErrorMessage(error);

  return (
    <div>
      <div className={styles.filterMenuContainer}>
        <FilterMenu
          alignMenu={align.RIGHT}
          selectedFilterKey={selectedFilterKey}
          filters={filters}
          customFilters={customFilters}
          buttonComponent={PageMenuButton}
          filterModalConnectorComponent={InteractiveSearchFilterModal}
          filterModalConnectorComponentProps={{ searchPayload }}
          onFilterSelect={handleFilterSelect}
        />
      </div>

      {isFetching ? <LoadingIndicator /> : null}

      {!isFetching && error ? (
        <Alert kind={kinds.DANGER} className={styles.alert}>
          {errorMessage ? (
            <>
              {translate('InteractiveSearchResultsFailedErrorMessage', {
                message:
                  errorMessage.charAt(0).toLowerCase() + errorMessage.slice(1),
              })}
            </>
          ) : (
            translate('MovieSearchResultsLoadError')
          )}
        </Alert>
      ) : null}

      {!isFetching && isPopulated && !totalItems ? (
        <Alert kind={kinds.INFO} className={styles.alert}>
          {translate('NoResultsFound')}
        </Alert>
      ) : null}

      {!!totalItems && isPopulated && !items.length ? (
        <Alert kind={kinds.WARNING} className={styles.alert}>
          {translate('AllResultsHiddenFilter')}
        </Alert>
      ) : null}

      {isPopulated && !!items.length ? (
        <Table
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortPress={handleSortPress}
        >
          <TableBody>
            {items.map((item) => {
              return (
                <InteractiveSearchRow
                  key={`${item.indexerId}-${item.guid}`}
                  {...item}
                  searchPayload={searchPayload}
                  onGrabPress={handleGrabPress}
                />
              );
            })}
          </TableBody>
        </Table>
      ) : null}

      {totalItems !== items.length && !!items.length ? (
        <Alert kind={kinds.INFO} className={styles.alert}>
          {translate('SomeResultsHiddenFilter')}
        </Alert>
      ) : null}
    </div>
  );
}

export default InteractiveSearch;
