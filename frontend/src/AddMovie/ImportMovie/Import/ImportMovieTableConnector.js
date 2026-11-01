import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import withAddDefaults from 'AddMovie/withAddDefaults';
import withMovies from 'Movie/withMovies';
import { queueLookupMovie, setImportMovieValue } from 'Store/Actions/importMovieActions';
import ImportMovieTable from './ImportMovieTable';

function createMapStateToProps() {
  return createSelector(
    (state, { addDefaults }) => addDefaults,
    (state) => state.importMovie,
    (state) => state.app.dimensions,
    (state, { allMovies }) => allMovies,
    (addDefaults, importMovie, dimensions, allMovies) => {
      return {
        defaultMonitor: addDefaults.monitor,
        defaultQualityProfileId: addDefaults.qualityProfileId,
        defaultMinimumAvailability: addDefaults.minimumAvailability,
        items: importMovie.items,
        isSmallScreen: dimensions.isSmallScreen,
        allMovies
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    onMovieLookup(name, path, relativePath) {
      dispatch(queueLookupMovie({
        name,
        path,
        relativePath,
        term: name
      }));
    },

    onSetImportMovieValue(values) {
      dispatch(setImportMovieValue(values));
    }
  };
}

export default withAddDefaults(withMovies(connect(createMapStateToProps, createMapDispatchToProps)(ImportMovieTable)));
