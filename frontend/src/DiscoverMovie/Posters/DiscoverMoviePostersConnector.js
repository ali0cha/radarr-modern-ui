import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import withUISettings from 'Settings/UI/withUISettings';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import DiscoverMoviePosters from './DiscoverMoviePosters';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverMovie.posterOptions,
    (state, { uiSettings }) => uiSettings,
    createDimensionsSelector(),
    (posterOptions, uiSettings, dimensions) => {
      return {
        posterOptions,
        showRelativeDates: uiSettings.showRelativeDates,
        shortDateFormat: uiSettings.shortDateFormat,
        timeFormat: uiSettings.timeFormat,
        isSmallScreen: dimensions.isSmallScreen
      };
    }
  );
}

export default withUISettings(connect(createMapStateToProps)(DiscoverMoviePosters));
