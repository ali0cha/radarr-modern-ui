import _ from 'lodash';
import { createSelector } from 'reselect';

function createImportMovieItemSelector() {
  return createSelector(
    (state, { id }) => id,
    (state, { addDefaults }) => addDefaults,
    (state) => state.importMovie,
    (state, { allMovies }) => allMovies,
    (id, addDefaults, importMovie, movies) => {
      const item = _.find(importMovie.items, { id }) || {};
      const selectedMovie = item && item.selectedMovie;
      const isExistingMovie = !!selectedMovie && _.some(movies, { tmdbId: selectedMovie.tmdbId });

      return {
        defaultMonitor: addDefaults.monitor,
        defaultQualityProfileId: addDefaults.qualityProfileId,
        ...item,
        isExistingMovie
      };
    }
  );
}

export default createImportMovieItemSelector;
