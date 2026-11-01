import { useMemo } from 'react';
import { MOVIE_SEARCH, REFRESH_MOVIE } from 'Commands/commandNames';
import { useExecutingCommands } from 'Commands/useCommands';
import Movie from 'Movie/Movie';
import { useMovie } from 'Movie/useMovies';

// A movie of the index, with whether it is being refreshed or searched
function useMovieIndexItem(movieId: number) {
  const movie = useMovie(movieId) as Movie;
  const executingCommands = useExecutingCommands();

  return useMemo(() => {
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

    return { movie, isRefreshingMovie, isSearchingMovie };
  }, [movie, movieId, executingCommands]);
}

export default useMovieIndexItem;
