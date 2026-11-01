import { find, some } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useAddDefaults } from 'AddMovie/useAddMovie';
import { useMovies } from 'Movie/useMovies';
import {
  queueLookupMovie,
  setImportMovieValue,
  useImportMovieItem,
  useImportMovieStore
} from '../../useImportMovie';
import ImportMovieSelectMovie from './ImportMovieSelectMovie';

function ImportMovieSelectMovieConnector(props) {
  const { id } = props;

  const defaults = useAddDefaults();
  const isLookingUpMovie = useImportMovieStore((state) => state.isLookingUpMovie);
  const item = useImportMovieItem(id);
  const { movies } = useMovies();

  const selectedMovie = item?.selectedMovie;
  const isExistingMovie = !!selectedMovie && some(movies, { tmdbId: selectedMovie.tmdbId });

  const handleSearchInputChange = useCallback((term) => {
    queueLookupMovie({
      name: id,
      term,
      topOfQueue: true
    });
  }, [id]);

  const handleMovieSelect = useCallback((tmdbId) => {
    setImportMovieValue({
      id,
      selectedMovie: find(item?.items, { tmdbId })
    });
  }, [id, item]);

  return (
    <ImportMovieSelectMovie
      {...props}
      defaultMonitor={defaults.monitor}
      defaultQualityProfileId={defaults.qualityProfileId}
      {...item}
      isLookingUpMovie={isLookingUpMovie}
      isExistingMovie={isExistingMovie}
      onSearchInputChange={handleSearchInputChange}
      onMovieSelect={handleMovieSelect}
    />
  );
}

ImportMovieSelectMovieConnector.propTypes = {
  id: PropTypes.string.isRequired
};

export default ImportMovieSelectMovieConnector;
