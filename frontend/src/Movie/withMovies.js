import React from 'react';
import { useMovies } from 'Movie/useMovies';

// For the connected components that have not been converted to hooks yet:
// the movies of the library are passed as the allMovies prop.
function withMovies(WrappedComponent) {
  function WithMovies(props) {
    const { movies } = useMovies();

    return (
      <WrappedComponent
        {...props}
        allMovies={movies}
      />
    );
  }

  return WithMovies;
}

export default withMovies;
