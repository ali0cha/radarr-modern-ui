import { createSelector } from 'reselect';
import Command from 'Commands/Command';
import { MOVIE_SEARCH, REFRESH_MOVIE } from 'Commands/commandNames';
import Movie from 'Movie/Movie';
import createExecutingCommandsSelector from 'Store/Selectors/createExecutingCommandsSelector';
import { createMovieSelectorForHook } from 'Store/Selectors/createMovieSelector';

function createMovieIndexItemSelector(movieId: number) {
  return createSelector(
    createMovieSelectorForHook(movieId),
    createExecutingCommandsSelector(),
    (movie: Movie, executingCommands: Command[]) => {
      const isRefreshingMovie = executingCommands.some((command) => {
        return (
          command.name === REFRESH_MOVIE &&
          command.body.movieIds?.includes(movieId)
        );
      });

      const isSearchingMovie = executingCommands.some((command) => {
        return (
          command.name === MOVIE_SEARCH &&
          command.body.movieIds?.includes(movieId)
        );
      });

      return {
        movie,
        isRefreshingMovie,
        isSearchingMovie,
      };
    }
  );
}

export default createMovieIndexItemSelector;
