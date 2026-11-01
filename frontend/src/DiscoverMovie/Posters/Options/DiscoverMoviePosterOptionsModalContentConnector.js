import React, { useCallback } from 'react';
import {
  useDiscoverMovieOptions,
  useDiscoverMovieStore,
  usePosterOptions
} from 'DiscoverMovie/useDiscoverMovie';
import DiscoverMoviePosterOptionsModalContent from './DiscoverMoviePosterOptionsModalContent';

function DiscoverMoviePosterOptionsModalContentConnector(props) {
  const options = useDiscoverMovieOptions();
  const posterOptions = usePosterOptions();

  const handleChangePosterOption = useCallback((payload) => {
    useDiscoverMovieStore.getState().setPosterOptions(payload);
  }, []);

  const handleChangeOption = useCallback((payload) => {
    useDiscoverMovieStore.getState().setOptions(payload);
  }, []);

  return (
    <DiscoverMoviePosterOptionsModalContent
      {...props}
      {...options}
      {...posterOptions}
      onChangePosterOption={handleChangePosterOption}
      onChangeOption={handleChangeOption}
    />
  );
}

export default DiscoverMoviePosterOptionsModalContentConnector;
