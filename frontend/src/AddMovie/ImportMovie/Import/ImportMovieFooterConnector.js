import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import withAddDefaults from 'AddMovie/withAddDefaults';
import { cancelLookupMovie, lookupUnsearchedMovies } from 'Store/Actions/importMovieActions';
import ImportMovieFooter from './ImportMovieFooter';

function isMixed(items, selectedIds, defaultValue, key) {
  return _.some(items, (movie) => {
    return selectedIds.indexOf(movie.id) > -1 && movie[key] !== defaultValue;
  });
}

function createMapStateToProps() {
  return createSelector(
    (state, { addDefaults }) => addDefaults,
    (state) => state.importMovie,
    (state, { selectedIds }) => selectedIds,
    (addDefaults, importMovie, selectedIds) => {
      const {
        monitor: defaultMonitor,
        qualityProfileId: defaultQualityProfileId,
        minimumAvailability: defaultMinimumAvailability
      } = addDefaults;

      const {
        isLookingUpMovie,
        isImporting,
        items,
        importError
      } = importMovie;

      const isMonitorMixed = isMixed(items, selectedIds, defaultMonitor, 'monitor');
      const isQualityProfileIdMixed = isMixed(items, selectedIds, defaultQualityProfileId, 'qualityProfileId');
      const isMinimumAvailabilityMixed = isMixed(items, selectedIds, defaultMinimumAvailability, 'minimumAvailability');
      const hasUnsearchedItems = !isLookingUpMovie && items.some((item) => !item.isPopulated);

      return {
        selectedCount: selectedIds.length,
        isLookingUpMovie,
        isImporting,
        defaultMonitor,
        defaultQualityProfileId,
        defaultMinimumAvailability,
        isMonitorMixed,
        isQualityProfileIdMixed,
        isMinimumAvailabilityMixed,
        importError,
        hasUnsearchedItems
      };
    }
  );
}

const mapDispatchToProps = {
  onLookupPress: lookupUnsearchedMovies,
  onCancelLookupPress: cancelLookupMovie
};

export default withAddDefaults(connect(createMapStateToProps, mapDispatchToProps)(ImportMovieFooter));
