import React, { useCallback } from 'react';
import FilterModal from 'Components/Filter/FilterModal';
import { useMovies } from 'Movie/useMovies';
import { filterBuilderProps, useMovieIndexStore } from './useMovieIndex';

interface MovieIndexFilterModalProps {
  isOpen: boolean;
}

export default function MovieIndexFilterModal(
  props: MovieIndexFilterModalProps
) {
  const { movies: sectionItems } = useMovies();
  const setFilter = useMovieIndexStore((state) => state.setFilter);

  const dispatchSetFilter = useCallback(
    ({ selectedFilterKey }: { selectedFilterKey: string | number }) => {
      setFilter(selectedFilterKey);
    },
    [setFilter]
  );

  return (
    <FilterModal
      // TODO: Don't spread all the props
      {...props}
      sectionItems={sectionItems}
      filterBuilderProps={filterBuilderProps}
      customFilterType="movieIndex"
      dispatchSetFilter={dispatchSetFilter}
    />
  );
}
