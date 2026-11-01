import React, { useCallback } from 'react';
import {
  useDiscoverMovieOptions,
  useDiscoverMovieStore,
  useOverviewOptions
} from 'DiscoverMovie/useDiscoverMovie';
import DiscoverMovieOverviewOptionsModalContent from './DiscoverMovieOverviewOptionsModalContent';

function DiscoverMovieOverviewOptionsModalContentConnector(props) {
  const options = useDiscoverMovieOptions();
  const overviewOptions = useOverviewOptions();

  const handleChangeOverviewOption = useCallback((payload) => {
    useDiscoverMovieStore.getState().setOverviewOptions(payload);
  }, []);

  const handleChangeOption = useCallback((payload) => {
    useDiscoverMovieStore.getState().setOptions(payload);
  }, []);

  return (
    <DiscoverMovieOverviewOptionsModalContent
      {...props}
      {...options}
      {...overviewOptions}
      onChangeOverviewOption={handleChangeOverviewOption}
      onChangeOption={handleChangeOption}
    />
  );
}

export default DiscoverMovieOverviewOptionsModalContentConnector;
