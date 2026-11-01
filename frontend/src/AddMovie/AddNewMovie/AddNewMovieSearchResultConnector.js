import PropTypes from 'prop-types';
import React from 'react';
import { useDimensions } from 'App/useAppStore';
import { useMovies } from 'Movie/useMovies';
import { useMovieFilesForMovie } from 'MovieFile/useMovieFiles';
import useUISettings from 'Settings/UI/useUISettings';
import AddNewMovieSearchResult from './AddNewMovieSearchResult';

function AddNewMovieSearchResultConnector(props) {
  const { tmdbId, internalId } = props;

  const { movies } = useMovies();
  const { isSmallScreen } = useDimensions();
  const { movieRuntimeFormat } = useUISettings();
  const { items: movieFiles } = useMovieFilesForMovie(internalId > 0 ? internalId : undefined);

  return (
    <AddNewMovieSearchResult
      {...props}
      existingMovieId={internalId}
      isExistingMovie={movies.some((movie) => movie.tmdbId === tmdbId)}
      isSmallScreen={isSmallScreen}
      movieFile={movieFiles.find((item) => item.movieId === internalId)}
      movieRuntimeFormat={movieRuntimeFormat}
    />
  );
}

AddNewMovieSearchResultConnector.propTypes = {
  tmdbId: PropTypes.number.isRequired,
  internalId: PropTypes.number
};

export default AddNewMovieSearchResultConnector;
