import React from 'react';
import MovieCreditPosters from '../MovieCreditPosters';
import { useMovieCreditsOfType } from '../useMovieCredits';
import MovieCastPoster from './MovieCastPoster';

interface MovieCastPostersProps {
  movieId: number;
  isSmallScreen: boolean;
}

function MovieCastPosters({ movieId, isSmallScreen }: MovieCastPostersProps) {
  const castCredits = useMovieCreditsOfType(movieId, 'cast');

  return (
    <MovieCreditPosters
      items={castCredits}
      itemComponent={MovieCastPoster}
      isSmallScreen={isSmallScreen}
    />
  );
}

export default MovieCastPosters;
