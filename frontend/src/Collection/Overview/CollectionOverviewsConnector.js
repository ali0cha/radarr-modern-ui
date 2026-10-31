import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import withUISettings from 'Settings/UI/withUISettings';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import CollectionOverviews from './CollectionOverviews';

function createMapStateToProps() {
  return createSelector(
    (state) => state.movieCollections.overviewOptions,
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

export default withUISettings(connect(createMapStateToProps)(CollectionOverviews));
