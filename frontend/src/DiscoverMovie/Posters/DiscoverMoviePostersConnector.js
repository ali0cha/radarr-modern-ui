import React from 'react';
import { useSelector } from 'react-redux';
import { usePosterOptions } from 'DiscoverMovie/useDiscoverMovie';
import useUISettings from 'Settings/UI/useUISettings';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import DiscoverMoviePosters from './DiscoverMoviePosters';

function DiscoverMoviePostersConnector(props) {
  const posterOptions = usePosterOptions();
  const uiSettings = useUISettings();
  const { isSmallScreen } = useSelector(createDimensionsSelector());

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
