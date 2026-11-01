import React, { useCallback } from 'react';
import FilterModal from 'Components/Filter/FilterModal';
import {
  filterBuilderProps,
  useDiscoverMovies,
  useDiscoverMovieStore,
} from './useDiscoverMovie';

interface DiscoverMovieFilterModalProps {
  isOpen: boolean;
}

export default function DiscoverMovieFilterModal(
  props: DiscoverMovieFilterModalProps
) {
  const { movies: sectionItems } = useDiscoverMovies();
  const setFilter = useDiscoverMovieStore((state) => state.setFilter);

  const dispatchSetFilter = useCallback(
    ({ selectedFilterKey }: { selectedFilterKey: string | number }) => {
      setFilter(selectedFilterKey);
    },
    [setFilter]
  );

  return (
    <FilterModal
      {...props}
      sectionItems={sectionItems}
      filterBuilderProps={filterBuilderProps}
      customFilterType="discoverMovie"
      dispatchSetFilter={dispatchSetFilter}
    />
  );
}
