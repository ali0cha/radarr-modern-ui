import { createSelector } from 'reselect';

function createCollectionExistingMovieSelector() {
  return createSelector(
    (state, { tmdbId }) => tmdbId,
    (state, { allMovies }) => allMovies,
    (tmdbId, allMovies) => {
      return allMovies.find((movie) => movie.tmdbId === tmdbId);
    }
  );
}

export default createCollectionExistingMovieSelector;
