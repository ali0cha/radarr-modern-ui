import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useDiscoverMovieColumns, useDiscoverMovieStore } from 'DiscoverMovie/useDiscoverMovie';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import DiscoverMovieTable from './DiscoverMovieTable';

function DiscoverMovieTableConnector(props) {
  const columns = useDiscoverMovieColumns();
  const { isSmallScreen } = useSelector(createDimensionsSelector());

  const handleSortPress = useCallback((sortKey) => {
    useDiscoverMovieStore.getState().setSort(sortKey);
  }, []);

  return (
    <DiscoverMovieTable
      {...props}
      isSmallScreen={isSmallScreen}
      columns={columns}
      onSortPress={handleSortPress}
    />
  );
}

export default DiscoverMovieTableConnector;
