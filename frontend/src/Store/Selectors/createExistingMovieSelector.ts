import { some } from 'lodash';
import { createSelector } from 'reselect';
import AppState from 'App/State/AppState';
import Movie from 'Movie/Movie';

// The movies of the library are passed as the allMovies prop, see withMovies
function createExistingMovieSelector() {
  return createSelector(
    (_: AppState, { tmdbId }: { tmdbId: number }) => tmdbId,
    (_: AppState, { allMovies }: { allMovies: Movie[] }) => allMovies,
    (tmdbId, movies) => {
      return some(movies, { tmdbId });
    }
  );
}

export default createExistingMovieSelector;
