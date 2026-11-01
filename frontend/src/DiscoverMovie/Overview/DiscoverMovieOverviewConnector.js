import React from 'react';
import { useDimensions } from 'App/useAppStore';
import DiscoverMovieOverview from './DiscoverMovieOverview';

function DiscoverMovieOverviewConnector(props) {
  const { isSmallScreen } = useDimensions();

  return (
    <DiscoverMovieOverview
      {...props}
      isSmallScreen={isSmallScreen}
    />
  );
}

export default DiscoverMovieOverviewConnector;
