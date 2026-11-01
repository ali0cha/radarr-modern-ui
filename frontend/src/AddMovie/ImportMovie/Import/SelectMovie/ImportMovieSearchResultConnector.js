import PropTypes from 'prop-types';
import React from 'react';
import { useMovies } from 'Movie/useMovies';
import ImportMovieSearchResult from './ImportMovieSearchResult';

function ImportMovieSearchResultConnector(props) {
  const { tmdbId } = props;

  const { movies } = useMovies();
  const isExistingMovie = movies.some((movie) => movie.tmdbId === tmdbId);

  return (
    <ImportMovieSearchResult
      {...props}
      isExistingMovie={isExistingMovie}
    />
  );
}

ImportMovieSearchResultConnector.propTypes = {
  tmdbId: PropTypes.number.isRequired
};

export default ImportMovieSearchResultConnector;
