import React from 'react';
import { useDimensions } from 'App/useAppStore';
import { useMovieCollectionsStore } from 'Collection/useMovieCollections';
import useUISettings from 'Settings/UI/useUISettings';
import CollectionOverviews from './CollectionOverviews';

function CollectionOverviewsConnector(props) {
  const overviewOptions = useMovieCollectionsStore((state) => state.overviewOptions);
  const uiSettings = useUISettings();
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

export default CollectionOverviewsConnector;
