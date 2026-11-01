import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useDimensions } from 'App/useAppStore';
import * as commandNames from 'Commands/commandNames';
import { executeCommand } from 'Commands/useCommands';
import withCommandExecuting from 'Commands/withCommandExecuting';
import withScrollPosition from 'Components/withScrollPosition';
import scrollPositions from 'Store/scrollPositions';
import Collection from './Collection';
import {
  useMovieCollections,
  useMovieCollectionsStore,
  useMovieCollectionsView,
  useSaveMovieCollections
} from './useMovieCollections';

function CollectionConnector(props) {
  const { isCommandExecuting } = props;

  const collections = useMovieCollectionsView();
  const { refetch } = useMovieCollections();
  const { saveCollections, isSaving } = useSaveMovieCollections();
  const dimensions = useDimensions();
  const setSort = useMovieCollectionsStore((state) => state.setSort);
  const setFilter = useMovieCollectionsStore((state) => state.setFilter);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleScroll = useCallback(({ scrollTop }) => {
    scrollPositions.movieCollections = scrollTop;
  }, []);

  const handleSortSelect = useCallback((sortKey) => {
    setSort(sortKey);
  }, [setSort]);

  const handleFilterSelect = useCallback((selectedFilterKey) => {
    setFilter(selectedFilterKey);
  }, [setFilter]);

  const handleRefreshMovieCollectionsPress = useCallback(() => {
    executeCommand({
      name: commandNames.REFRESH_COLLECTIONS
    });
  }, []);

  return (
    <Collection
      {...props}
      {...collections}
      isRefreshingCollections={isCommandExecuting}
      isSmallScreen={dimensions.isSmallScreen}
      isSaving={isSaving}
      isAdding={false}
      onSortSelect={handleSortSelect}
      onFilterSelect={handleFilterSelect}
      onRefreshMovieCollectionsPress={handleRefreshMovieCollectionsPress}
      onScroll={handleScroll}
      onUpdateSelectedPress={saveCollections}
    />
  );
}

CollectionConnector.propTypes = {
  isCommandExecuting: PropTypes.bool.isRequired
};

export default withScrollPosition(
  withCommandExecuting(commandNames.REFRESH_COLLECTIONS)(CollectionConnector),
  'movieCollections'
);
