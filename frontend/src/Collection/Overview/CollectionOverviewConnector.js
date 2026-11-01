import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useToggleCollectionMonitored } from 'Collection/useMovieCollections';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import CollectionOverview from './CollectionOverview';

const selectDimensions = createDimensionsSelector();

function CollectionOverviewConnector(props) {
  const { collectionId } = props;

  const { isSmallScreen } = useSelector(selectDimensions);
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
