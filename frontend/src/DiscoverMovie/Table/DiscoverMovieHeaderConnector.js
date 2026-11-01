import React, { useCallback } from 'react';
import { useDiscoverMovieStore } from 'DiscoverMovie/useDiscoverMovie';
import DiscoverMovieHeader from './DiscoverMovieHeader';

function DiscoverMovieHeaderConnector(props) {
  const handleTableOptionChange = useCallback((payload) => {
    useDiscoverMovieStore.getState().setTableOptions(payload);
  }, []);

  return (
    <DiscoverMovieHeader
      {...props}
      onTableOptionChange={handleTableOptionChange}
    />
  );
}

export default DiscoverMovieHeaderConnector;
