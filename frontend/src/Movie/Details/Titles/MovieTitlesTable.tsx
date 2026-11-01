import React, { useMemo } from 'react';
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Column from 'Components/Table/Column';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import { kinds } from 'Helpers/Props';
import { useMovie, useMoviesFetching } from 'Movie/useMovies';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';
import MovieTitlesRow from './MovieTitlesRow';
import styles from './MovieTitlesTable.module.css';

const columns: Column[] = [
  {
    name: 'alternativeTitle',
    label: () => translate('AlternativeTitle'),
    isVisible: true,
  },
  {
    name: 'sourceType',
    label: () => translate('Type'),
    isVisible: true,
  },
];

interface MovieTitlesProps {
  movieId: number;
}

function MovieTitlesTable({ movieId }: MovieTitlesProps) {
  const {
    isMoviesFetching: isFetching,
    isMoviesPopulated: isPopulated,
    moviesError: error,
  } = useMoviesFetching();
  const movie = useMovie(movieId);
  const items = useMemo(() => movie?.alternateTitles ?? [], [movie]);

  const sortedItems = useMemo(
    () => [...items].sort(sortByProp('title')),
    [items]
  );

  if (!isFetching && !!error) {
    return (
      <Alert kind={kinds.DANGER}>
        {translate('AlternativeTitlesLoadError')}
      </Alert>
    );
  }

  return (
    <div className={styles.container}>
      {isFetching && <LoadingIndicator />}

      {isPopulated && !items.length && !error ? (
        <div className={styles.blankpad}>
          {translate('NoAlternativeTitles')}
        </div>
      ) : null}

      {isPopulated && !!items.length && !error ? (
        <Table columns={columns}>
          <TableBody>
            {sortedItems.map((item) => (
              <MovieTitlesRow
                key={item.id}
                title={item.title}
                sourceType={item.sourceType}
              />
            ))}
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
}

export default MovieTitlesTable;
