import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from 'Components/NotFound';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { useMovies } from 'Movie/useMovies';
import translate from 'Utilities/String/translate';
import MovieDetails from './MovieDetails';

function MovieDetailsPage() {
  const { movies: allMovies } = useMovies();
  const { titleSlug } = useParams<{ titleSlug: string }>();
  const navigate = useNavigate();

  const movieIndex = allMovies.findIndex(
    (movie) => movie.titleSlug === titleSlug
  );

  const previousIndex = usePrevious(movieIndex);

  useEffect(() => {
    if (
      movieIndex === -1 &&
      previousIndex !== -1 &&
      previousIndex !== undefined
    ) {
      navigate('/');
    }
  }, [movieIndex, previousIndex, navigate]);

  if (movieIndex === -1) {
    return <NotFound message={translate('MovieCannotBeFound')} />;
  }

  return <MovieDetails movieId={allMovies[movieIndex].id} />;
}

export default MovieDetailsPage;
