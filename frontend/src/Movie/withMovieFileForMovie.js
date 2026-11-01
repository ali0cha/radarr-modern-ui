import PropTypes from 'prop-types';
import React from 'react';
import { useMovieFilesForMovie } from 'MovieFile/useMovieFiles';

// For the connected components that have not been converted to hooks yet: the
// movieFile prop is the file of the movie that the internalId prop is the id of.
function withMovieFileForMovie(WrappedComponent) {
  function WithMovieFileForMovie(props) {
    const { internalId } = props;
    const { items } = useMovieFilesForMovie(internalId > 0 ? internalId : undefined);

    return (
      <WrappedComponent
        {...props}
        movieFile={items.find((item) => item.movieId === internalId)}
      />
    );
  }

  WithMovieFileForMovie.propTypes = {
    internalId: PropTypes.number
  };

  return WithMovieFileForMovie;
}

export default withMovieFileForMovie;
