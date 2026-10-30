import Movie from 'Movie/Movie';
import { update } from 'Store/Actions/baseActions';

function updateMovies(
  section: string,
  movies: Movie[],
  movieIds: number[],
  options: Partial<Movie>
) {
  const data = movies.map((item) =>
    movieIds.indexOf(item.id) > -1 ? { ...item, ...options } : item
  );

  return update({ section, data });
}

export default updateMovies;
