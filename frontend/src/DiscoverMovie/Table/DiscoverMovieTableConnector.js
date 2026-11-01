import React, { useCallback } from 'react';
import { useDimensions } from 'App/useAppStore';
import { useDiscoverMovieColumns, useDiscoverMovieStore } from 'DiscoverMovie/useDiscoverMovie';
import DiscoverMovieTable from './DiscoverMovieTable';

function DiscoverMovieTableConnector(props) {
  const columns = useDiscoverMovieColumns();
  const { isSmallScreen } = useDimensions();

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
