import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import withDimensions from 'App/withDimensions';
import withMovieFileForMovie from 'Movie/withMovieFileForMovie';
import withMovies from 'Movie/withMovies';
import withUISettings from 'Settings/UI/withUISettings';
import createExistingMovieSelector from 'Store/Selectors/createExistingMovieSelector';
import AddNewMovieSearchResult from './AddNewMovieSearchResult';

function createMapStateToProps() {
  return createSelector(
    createExistingMovieSelector(),
    (state, { dimensions }) => dimensions,
    (state, { movieFile }) => movieFile,
    (state, { internalId }) => internalId,
    (state, { uiSettings }) => uiSettings.movieRuntimeFormat,
    (isExistingMovie, dimensions, movieFile, internalId, movieRuntimeFormat) => {
      return {
        existingMovieId: internalId,
        isExistingMovie,
        isSmallScreen: dimensions.isSmallScreen,
        movieFile,
        movieRuntimeFormat
      };
    }
  );
}

export default withDimensions(withMovies(withMovieFileForMovie(withUISettings(connect(createMapStateToProps)(AddNewMovieSearchResult)))));
