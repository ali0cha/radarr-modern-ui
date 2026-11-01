import PropTypes from 'prop-types';
import React from 'react';
import { useDimensions } from 'App/useAppStore';
import { useMovieCollectionsStore } from 'Collection/useMovieCollections';
import withUISettings from 'Settings/UI/withUISettings';
import CollectionOverviews from './CollectionOverviews';

function CollectionOverviewsConnector(props) {
  const { uiSettings } = props;

  const overviewOptions = useMovieCollectionsStore((state) => state.overviewOptions);
  const dimensions = useDimensions();

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
