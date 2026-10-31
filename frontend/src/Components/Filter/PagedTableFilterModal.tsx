import React, { useCallback } from 'react';
import { CustomFilter, Filter, FilterBuilderProp } from 'App/State/AppState';
import FilterModal from 'Components/Filter/FilterModal';

interface PagedTableFilterModalProps {
  isOpen: boolean;
  selectedFilterKey: string | number;
  filters: Filter[];
  customFilters: CustomFilter[];
  onModalClose: () => void;
  filterBuilderProps: FilterBuilderProp<unknown>[];
  customFilterType: string;
  onFilterSelect: (selectedFilterKey: string | number) => void;
}

// The filter modal of a table that the server filters: the values to choose
// from do not depend on the rows that are shown.
function PagedTableFilterModal({
  filterBuilderProps,
  customFilterType,
  onFilterSelect,
  ...otherProps
}: PagedTableFilterModalProps) {
  const dispatchSetFilter = useCallback(
    ({ selectedFilterKey }: { selectedFilterKey: string | number }) => {
      onFilterSelect(selectedFilterKey);
    },
    [onFilterSelect]
  );

  return (
    <FilterModal
      {...otherProps}
      sectionItems={[]}
      filterBuilderProps={filterBuilderProps}
      customFilterType={customFilterType}
      dispatchSetFilter={dispatchSetFilter}
    />
  );
}

export default PagedTableFilterModal;
