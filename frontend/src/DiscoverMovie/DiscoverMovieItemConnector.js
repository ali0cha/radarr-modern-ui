import PropTypes from 'prop-types';
import React from 'react';
import { useDiscoverMovie } from './useDiscoverMovie';

function DiscoverMovieItemConnector({ movieId, component: ItemComponent, ...otherProps }) {
  const movie = useDiscoverMovie(movieId);

  // If a movie is added or removed this may fire before the parent
  // re-renders, which results in an undefined movie, if that happens
  // we do not want to show a movie that has no information available.
  if (!movie || !movie.tmdbId) {
    return null;
  }

  return (
    <ItemComponent
      {...otherProps}
      {...movie}
      movieId={movieId}
    />
  );
}

DiscoverMovieItemConnector.propTypes = {
  movieId: PropTypes.number,
  component: PropTypes.elementType.isRequired
};

export default DiscoverMovieItemConnector;
