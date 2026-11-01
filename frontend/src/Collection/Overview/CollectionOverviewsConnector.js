import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useMovieCollectionsStore } from 'Collection/useMovieCollections';
import withUISettings from 'Settings/UI/withUISettings';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import CollectionOverviews from './CollectionOverviews';

const selectDimensions = createDimensionsSelector();

function CollectionOverviewsConnector(props) {
  const { uiSettings } = props;

  const overviewOptions = useMovieCollectionsStore((state) => state.overviewOptions);
  const dimensions = useSelector(selectDimensions);

  return (
    <CollectionOverviews
      {...props}
      overviewOptions={overviewOptions}
      showRelativeDates={uiSettings.showRelativeDates}
      shortDateFormat={uiSettings.shortDateFormat}
      longDateFormat={uiSettings.longDateFormat}
      timeFormat={uiSettings.timeFormat}
      isSmallScreen={dimensions.isSmallScreen}
    />
  );
}

CollectionOverviewsConnector.propTypes = {
  uiSettings: PropTypes.object.isRequired
};

export default withUISettings(CollectionOverviewsConnector);
