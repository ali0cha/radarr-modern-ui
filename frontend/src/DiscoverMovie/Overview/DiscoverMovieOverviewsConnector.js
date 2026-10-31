import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import withUISettings from 'Settings/UI/withUISettings';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import DiscoverMovieOverviews from './DiscoverMovieOverviews';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverMovie.overviewOptions,
    (state, { uiSettings }) => uiSettings,
    createDimensionsSelector(),
    (overviewOptions, uiSettings, dimensions) => {
      return {
        overviewOptions,
        showRelativeDates: uiSettings.showRelativeDates,
        shortDateFormat: uiSettings.shortDateFormat,
        longDateFormat: uiSettings.longDateFormat,
        timeFormat: uiSettings.timeFormat,
        isSmallScreen: dimensions.isSmallScreen
      };
    }
  );
}

export default withUISettings(connect(createMapStateToProps)(DiscoverMovieOverviews));
