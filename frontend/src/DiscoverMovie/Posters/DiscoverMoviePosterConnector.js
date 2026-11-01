import React from 'react';
import { useDimensions } from 'App/useAppStore';
import useUISettings from 'Settings/UI/useUISettings';
import DiscoverMoviePoster from './DiscoverMoviePoster';

function DiscoverMoviePosterConnector(props) {
  const { movieRuntimeFormat } = useUISettings();
  const { isSmallScreen } = useDimensions();

  return (
    <DiscoverMoviePoster
      {...props}
      movieRuntimeFormat={movieRuntimeFormat}
      isSmallScreen={isSmallScreen}
    />
  );
}

export default DiscoverMoviePosterConnector;
