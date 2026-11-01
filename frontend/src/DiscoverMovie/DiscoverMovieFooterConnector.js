import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import DiscoverMovieFooter from './DiscoverMovieFooter';
import { useAddDefaults, useDiscoverMovieStore } from './useDiscoverMovie';

function DiscoverMovieFooterConnector({ selectedIds, isAdding, isExcluding, ...otherProps }) {
  const {
    monitor: defaultMonitor,
    qualityProfileId: defaultQualityProfileId,
    minimumAvailability: defaultMinimumAvailability,
    rootFolderPath: defaultRootFolderPath,
    searchForMovie: defaultSearchForMovie
  } = useAddDefaults();

  const handleInputChange = useCallback(({ name, value }) => {
    useDiscoverMovieStore.getState().setDefaults({ [name]: value });
  }, []);

  return (
    <DiscoverMovieFooter
      {...otherProps}
      selectedCount={selectedIds.length}
      isAdding={isAdding}
      isExcluding={isExcluding}
      defaultMonitor={defaultMonitor}
      defaultQualityProfileId={defaultQualityProfileId}
      defaultMinimumAvailability={defaultMinimumAvailability}
      defaultRootFolderPath={defaultRootFolderPath}
      defaultSearchForMovie={defaultSearchForMovie}
      onInputChange={handleInputChange}
    />
  );
}

DiscoverMovieFooterConnector.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  isAdding: PropTypes.bool.isRequired,
  isExcluding: PropTypes.bool.isRequired
};

export default DiscoverMovieFooterConnector;
