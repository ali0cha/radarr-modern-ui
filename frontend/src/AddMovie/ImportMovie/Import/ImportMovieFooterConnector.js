import { some } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useAddDefaults } from 'AddMovie/useAddMovie';
import {
  cancelLookupMovie,
  lookupUnsearchedMovies,
  useImportMovieStore
} from '../useImportMovie';
import ImportMovieFooter from './ImportMovieFooter';

function isMixed(items, selectedIds, defaultValue, key) {
  return some(items, (movie) => {
    return selectedIds.indexOf(movie.id) > -1 && movie[key] !== defaultValue;
  });
}

function ImportMovieFooterConnector({ selectedIds, ...otherProps }) {
  const {
    monitor: defaultMonitor,
    qualityProfileId: defaultQualityProfileId,
    minimumAvailability: defaultMinimumAvailability
  } = useAddDefaults();

  const {
    isLookingUpMovie,
    isImporting,
    items,
    importError
  } = useImportMovieStore();

  const isMonitorMixed = isMixed(items, selectedIds, defaultMonitor, 'monitor');
  const isQualityProfileIdMixed = isMixed(items, selectedIds, defaultQualityProfileId, 'qualityProfileId');
  const isMinimumAvailabilityMixed = isMixed(items, selectedIds, defaultMinimumAvailability, 'minimumAvailability');
  const hasUnsearchedItems = !isLookingUpMovie && items.some((item) => !item.isPopulated);

  return (
    <ImportMovieFooter
      {...otherProps}
      selectedCount={selectedIds.length}
      isLookingUpMovie={isLookingUpMovie}
      isImporting={isImporting}
      defaultMonitor={defaultMonitor}
      defaultQualityProfileId={defaultQualityProfileId}
      defaultMinimumAvailability={defaultMinimumAvailability}
      isMonitorMixed={isMonitorMixed}
      isQualityProfileIdMixed={isQualityProfileIdMixed}
      isMinimumAvailabilityMixed={isMinimumAvailabilityMixed}
      importError={importError}
      hasUnsearchedItems={hasUnsearchedItems}
      onLookupPress={lookupUnsearchedMovies}
      onCancelLookupPress={cancelLookupMovie}
    />
  );
}

ImportMovieFooterConnector.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ImportMovieFooterConnector;
