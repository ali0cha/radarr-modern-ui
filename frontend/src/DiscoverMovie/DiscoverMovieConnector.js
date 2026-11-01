import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as commandNames from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import withScrollPosition from 'Components/withScrollPosition';
import { usePrefetchRootFolders } from 'RootFolder/useRootFolders';
import scrollPositions from 'Store/scrollPositions';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import DiscoverMovie from './DiscoverMovie';
import {
  useAddDiscoverMovies,
  useDiscoverMovieStore,
  useDiscoverMovieView,
  useExcludeDiscoverMovies
} from './useDiscoverMovie';

function DiscoverMovieConnectorBase({ initialScrollTop }) {
  const {
    handleSortSelect,
    handleFilterSelect,
    handleViewSelect,
    refetch,
    ...discoverMovie
  } = useDiscoverMovieView();

  const { isSmallScreen } = useSelector(createDimensionsSelector());
  const isSyncingLists = useCommandExecuting(commandNames.IMPORT_LIST_SYNC);
  const { addMovies, isAdding } = useAddDiscoverMovies();
  const { excludeMovies, isExcluding } = useExcludeDiscoverMovies();

  const handleTableOptionChange = useCallback((payload) => {
    useDiscoverMovieStore.getState().setTableOptions(payload);
  }, []);

  const handleScroll = useCallback(({ scrollTop }) => {
    scrollPositions.discoverMovie = scrollTop;
  }, []);

  const handleAddMoviesPress = useCallback(({ ids, addOptions }) => {
    addMovies({ tmdbIds: ids, addOptions });
  }, [addMovies]);

  const handleExcludeMoviesPress = useCallback(({ ids }) => {
    excludeMovies(ids);
  }, [excludeMovies]);

  const handleImportListSyncPress = useCallback(() => {
    executeCommand({
      name: commandNames.IMPORT_LIST_SYNC,
      commandFinished: () => refetch()
    });
  }, [refetch]);

  return (
    <DiscoverMovie
      {...discoverMovie}
      initialScrollTop={initialScrollTop}
      isSmallScreen={isSmallScreen}
      isSyncingLists={isSyncingLists}
      isAdding={isAdding}
      isExcluding={isExcluding}
      onSortSelect={handleSortSelect}
      onFilterSelect={handleFilterSelect}
      onViewSelect={handleViewSelect}
      onTableOptionChange={handleTableOptionChange}
      onScroll={handleScroll}
      onAddMoviesPress={handleAddMoviesPress}
      onExcludeMoviesPress={handleExcludeMoviesPress}
      onImportListSyncPress={handleImportListSyncPress}
    />
  );
}

DiscoverMovieConnectorBase.propTypes = {
  initialScrollTop: PropTypes.number
};

const ConnectedDiscoverMovie = withScrollPosition(DiscoverMovieConnectorBase, 'discoverMovie');

function DiscoverMovieConnector(props) {
  usePrefetchRootFolders();

  return <ConnectedDiscoverMovie {...props} />;
}

export default DiscoverMovieConnector;
