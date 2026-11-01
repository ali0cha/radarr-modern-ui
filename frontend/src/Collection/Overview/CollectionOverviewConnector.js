import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDimensions } from 'App/useAppStore';
import { useToggleCollectionMonitored } from 'Collection/useMovieCollections';
import CollectionOverview from './CollectionOverview';

function CollectionOverviewConnector(props) {
  const { collectionId } = props;

  const { isSmallScreen } = useDimensions();
  const { toggleMonitored } = useToggleCollectionMonitored(collectionId);

  const handleMonitorTogglePress = useCallback((monitored) => {
    toggleMonitored(monitored);
  }, [toggleMonitored]);

  return (
    <CollectionOverview
      {...props}
      isSmallScreen={isSmallScreen}
      onMonitorTogglePress={handleMonitorTogglePress}
    />
  );
}

CollectionOverviewConnector.propTypes = {
  collectionId: PropTypes.number.isRequired,
  monitored: PropTypes.bool.isRequired
};

export default CollectionOverviewConnector;
