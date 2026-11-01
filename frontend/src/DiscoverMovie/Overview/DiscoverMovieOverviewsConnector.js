import React from 'react';
import { useDimensions } from 'App/useAppStore';
import { useOverviewOptions } from 'DiscoverMovie/useDiscoverMovie';
import useUISettings from 'Settings/UI/useUISettings';
import DiscoverMovieOverviews from './DiscoverMovieOverviews';

function DiscoverMovieOverviewsConnector(props) {
  const overviewOptions = useOverviewOptions();
  const uiSettings = useUISettings();
  const { isSmallScreen } = useDimensions();

  return (
    <DiscoverMovieOverviews
      {...props}
      overviewOptions={overviewOptions}
      showRelativeDates={uiSettings.showRelativeDates}
      shortDateFormat={uiSettings.shortDateFormat}
      longDateFormat={uiSettings.longDateFormat}
      timeFormat={uiSettings.timeFormat}
      isSmallScreen={isSmallScreen}
    />
  );
}

export default DiscoverMovieOverviewsConnector;
