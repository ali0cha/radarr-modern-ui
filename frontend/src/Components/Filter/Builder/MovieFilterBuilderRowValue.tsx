import React from 'react';
import { useMovies } from 'Movie/useMovies';
import sortByProp from 'Utilities/Array/sortByProp';
import FilterBuilderRowValue from './FilterBuilderRowValue';
import FilterBuilderRowValueProps from './FilterBuilderRowValueProps';

function MovieFilterBuilderRowValue(props: FilterBuilderRowValueProps) {
  const { movies: allMovies } = useMovies();

  const tagList = allMovies
    .map((movie) => ({ id: movie.id, name: movie.title }))
    .sort(sortByProp('name'));

  return <FilterBuilderRowValue {...props} tagList={tagList} />;
}

export default MovieFilterBuilderRowValue;
