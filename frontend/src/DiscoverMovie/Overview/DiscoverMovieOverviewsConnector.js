import React from 'react';
import { useSelector } from 'react-redux';
import { useOverviewOptions } from 'DiscoverMovie/useDiscoverMovie';
import useUISettings from 'Settings/UI/useUISettings';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import DiscoverMovieOverviews from './DiscoverMovieOverviews';

function DiscoverMovieOverviewsConnector(props) {
  const overviewOptions = useOverviewOptions();
  const uiSettings = useUISettings();
  const { isSmallScreen } = useSelector(createDimensionsSelector());

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
