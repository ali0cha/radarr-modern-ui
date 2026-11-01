import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useExcludeDiscoverMovies } from 'DiscoverMovie/useDiscoverMovie';
import ExcludeMovieModalContent from './ExcludeMovieModalContent';

function ExcludeMovieModalContentConnector(props) {
  const { tmdbId, onModalClose } = props;

  const handleExcluded = useCallback(() => onModalClose(true), [onModalClose]);
  const { excludeMovies } = useExcludeDiscoverMovies(handleExcluded);

  const handleExcludePress = useCallback(() => {
    excludeMovies([tmdbId]);
  }, [tmdbId, excludeMovies]);

  return (
    <ExcludeMovieModalContent
      {...props}
      onExcludePress={handleExcludePress}
    />
  );
}

ExcludeMovieModalContentConnector.propTypes = {
  tmdbId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default ExcludeMovieModalContentConnector;
