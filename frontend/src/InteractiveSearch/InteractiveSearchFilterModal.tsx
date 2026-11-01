import React, { useCallback } from 'react';
import FilterModal from 'Components/Filter/FilterModal';
import InteractiveSearchPayload from './InteractiveSearchPayload';
import {
  filterBuilderProps,
  useReleases,
  useReleasesFilterStore,
} from './useReleases';

interface InteractiveSearchFilterModalProps {
  isOpen: boolean;
  searchPayload: InteractiveSearchPayload;
}

export default function InteractiveSearchFilterModal({
  searchPayload,
  ...otherProps
}: InteractiveSearchFilterModalProps) {
  const { allItems: sectionItems } = useReleases(searchPayload);
  const setFilter = useReleasesFilterStore((state) => state.setFilter);

  const dispatchSetFilter = useCallback(
    ({ selectedFilterKey }: { selectedFilterKey: string | number }) => {
      setFilter(selectedFilterKey);
    },
    [setFilter]
  );

  return (
    <FilterModal
      // TODO: Don't spread all the props
      {...otherProps}
      sectionItems={sectionItems}
      filterBuilderProps={filterBuilderProps}
      customFilterType="releases"
      dispatchSetFilter={dispatchSetFilter}
    />
  );
}
