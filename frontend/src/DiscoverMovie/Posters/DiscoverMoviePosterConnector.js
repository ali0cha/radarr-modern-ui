import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import withUISettings from 'Settings/UI/withUISettings';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import DiscoverMoviePoster from './DiscoverMoviePoster';

function createMapStateToProps() {
  return createSelector(
    (state, { uiSettings }) => uiSettings.movieRuntimeFormat,
    createDimensionsSelector(),
    (movieRuntimeFormat, dimensions) => {
      return {
        movieRuntimeFormat,
        isSmallScreen: dimensions.isSmallScreen
      };
    }
  );
}

export default withUISettings(connect(createMapStateToProps)(DiscoverMoviePoster));
