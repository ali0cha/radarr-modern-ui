import React from 'react';
import { useDimensions } from 'App/useAppStore';
import useUISettings from 'Settings/UI/useUISettings';
import DiscoverMovieRow from './DiscoverMovieRow';

function DiscoverMovieRowConnector(props) {
  const { movieRuntimeFormat } = useUISettings();
  const { isSmallScreen } = useDimensions();

  return (
    <DiscoverMovieRow
      {...props}
      movieRuntimeFormat={movieRuntimeFormat}
      isSmallScreen={isSmallScreen}
    />
  );
}

export default DiscoverMovieRowConnector;
