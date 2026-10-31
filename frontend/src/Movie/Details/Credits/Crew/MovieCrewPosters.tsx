import React from 'react';
import MovieCreditPosters from '../MovieCreditPosters';
import { useMovieCreditsOfType } from '../useMovieCredits';
import MovieCrewPoster from './MovieCrewPoster';

interface MovieCrewPostersProps {
  movieId: number;
  isSmallScreen: boolean;
}

function MovieCrewPosters({ movieId, isSmallScreen }: MovieCrewPostersProps) {
  const crewCredits = useMovieCreditsOfType(movieId, 'crew');

  return (
    <MovieCreditPosters
      items={crewCredits}
      itemComponent={MovieCrewPoster}
      isSmallScreen={isSmallScreen}
    />
  );
}

export default MovieCrewPosters;
