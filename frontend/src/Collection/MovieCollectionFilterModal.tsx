import React, { useCallback } from 'react';
import FilterModal from 'Components/Filter/FilterModal';
import {
  filterBuilderProps,
  useMovieCollections,
  useMovieCollectionsStore,
} from './useMovieCollections';

interface MovieCollectionFilterModalProps {
  isOpen: boolean;
}

export default function MovieCollectionFilterModal(
  props: MovieCollectionFilterModalProps
) {
  const { collections: sectionItems } = useMovieCollections();
  const setFilter = useMovieCollectionsStore((state) => state.setFilter);

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
      customFilterType="movieCollections"
      dispatchSetFilter={dispatchSetFilter}
    />
  );
}
