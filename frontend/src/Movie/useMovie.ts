export type MovieEntity =
  | 'calendar'
  | 'movies'
  | 'interactiveImport.movies'
  | 'wanted.cutoffUnmet'
  | 'wanted.missing';

export { useMovie as default } from './useMovies';
