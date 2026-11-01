import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import withMovies from 'Movie/withMovies';
import { queueLookupMovie, setImportMovieValue } from 'Store/Actions/importMovieActions';
import ImportMovieTable from './ImportMovieTable';

function createMapStateToProps() {
  return createSelector(
    (state) => state.addMovie,
    (state) => state.importMovie,
    (state) => state.app.dimensions,
    (state, { allMovies }) => allMovies,
    (addMovie, importMovie, dimensions, allMovies) => {
      return {
        defaultMonitor: addMovie.defaults.monitor,
        defaultQualityProfileId: addMovie.defaults.qualityProfileId,
        defaultMinimumAvailability: addMovie.defaults.minimumAvailability,
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

export default withMovies(connect(createMapStateToProps, createMapDispatchToProps)(ImportMovieTable));
