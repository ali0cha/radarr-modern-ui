import _ from 'lodash';
import { useMemo } from 'react';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import MovieCredit, { MovieCreditType } from 'typings/MovieCredit';

function useMovieCredits(movieId: number) {
  return useApiQuery<MovieCredit[]>({
    path: `/credit?movieId=${movieId}`,
    queryOptions: {
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });
}

export function useMovieCreditsOfType(
  movieId: number,
  movieCreditType: MovieCreditType
) {
  const { data } = useMovieCredits(movieId);

  return useMemo(() => {
    const credits = (data ?? []).filter(({ type }) => type === movieCreditType);
    const sortedCredits = credits.sort((a, b) => a.order - b.order);

    return _.uniqBy(sortedCredits, 'personName');
  }, [data, movieCreditType]);
}

export default useMovieCredits;
