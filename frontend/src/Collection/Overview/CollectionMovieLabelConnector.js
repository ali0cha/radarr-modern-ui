import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDimensions } from 'App/useAppStore';
import { useMovies, useToggleMovieMonitored } from 'Movie/useMovies';
import CollectionMovieLabel from './CollectionMovieLabel';

function CollectionMovieLabelConnector(props) {
  const { tmdbId } = props;

  const { movies } = useMovies();
  const { isSmallScreen } = useDimensions();
  const existingMovie = movies.find((movie) => movie.tmdbId === tmdbId);
  const { toggleMonitored, isSaving } = useToggleMovieMonitored(existingMovie ? existingMovie.id : 0);

  const handleMonitorTogglePress = useCallback((monitored) => {
    toggleMonitored(monitored);
  }, [toggleMonitored]);

  return (
    <CollectionMovieLabel
      {...props}
      isSmallScreen={isSmallScreen}
      isExistingMovie={!!existingMovie}
      {...existingMovie}
      isSaving={isSaving}
      onMonitorTogglePress={handleMonitorTogglePress}
    />
  );
}

CollectionMovieLabelConnector.propTypes = {
  tmdbId: PropTypes.number.isRequired
};

export default CollectionMovieLabelConnector;
