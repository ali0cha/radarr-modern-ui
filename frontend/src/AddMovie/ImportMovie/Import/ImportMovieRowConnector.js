import { some } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useMovies } from 'Movie/useMovies';
import { setImportMovieValue, useImportMovieItem } from '../useImportMovie';
import ImportMovieRow from './ImportMovieRow';

function ImportMovieRowConnector(props) {
  const { id } = props;

  const item = useImportMovieItem(id);
  const { movies } = useMovies();

  const handleInputChange = useCallback(({ name, value }) => {
    setImportMovieValue({
      id,
      [name]: value
    });
  }, [id]);

  // Don't show the row until we have the information we require for it.
  if (!item || !item.items || !item.monitor) {
    return null;
  }

  const selectedMovie = item.selectedMovie;
  const isExistingMovie = !!selectedMovie && some(movies, { tmdbId: selectedMovie.tmdbId });

  return (
    <ImportMovieRow
      {...props}
      {...item}
      isExistingMovie={isExistingMovie}
      onInputChange={handleInputChange}
    />
  );
}

ImportMovieRowConnector.propTypes = {
  rootFolderId: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired
};

export default ImportMovieRowConnector;
