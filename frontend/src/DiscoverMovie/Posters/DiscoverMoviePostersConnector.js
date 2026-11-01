import React from 'react';
import { useDimensions } from 'App/useAppStore';
import { usePosterOptions } from 'DiscoverMovie/useDiscoverMovie';
import useUISettings from 'Settings/UI/useUISettings';
import DiscoverMoviePosters from './DiscoverMoviePosters';

function DiscoverMoviePostersConnector(props) {
  const posterOptions = usePosterOptions();
  const uiSettings = useUISettings();
  const { isSmallScreen } = useDimensions();

  return (
    <DiscoverMoviePosters
      {...props}
      posterOptions={posterOptions}
      showRelativeDates={uiSettings.showRelativeDates}
      shortDateFormat={uiSettings.shortDateFormat}
      timeFormat={uiSettings.timeFormat}
      isSmallScreen={isSmallScreen}
    />
  );
}

export default DiscoverMoviePostersConnector;
