import React, { useCallback } from 'react';
import { useDiscoverMovieOptions, useDiscoverMovieStore } from 'DiscoverMovie/useDiscoverMovie';
import DiscoverMovieTableOptions from './DiscoverMovieTableOptions';

function DiscoverMovieTableOptionsConnector(props) {
  const options = useDiscoverMovieOptions();

  const handleChangeOption = useCallback((payload) => {
    useDiscoverMovieStore.getState().setOptions(payload);
  }, []);

  return (
    <DiscoverMovieTableOptions
      {...props}
      {...options}
      onChangeOption={handleChangeOption}
    />
  );
}

export default DiscoverMovieTableOptionsConnector;
