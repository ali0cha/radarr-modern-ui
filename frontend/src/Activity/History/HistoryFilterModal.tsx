import React from 'react';
import PagedTableFilterModal from 'Components/Filter/PagedTableFilterModal';
import { historyTable } from './useHistory';

// The filter menu passes it the state of the filters
type HistoryFilterModalProps = Omit<
  React.ComponentProps<typeof PagedTableFilterModal>,
  'filterBuilderProps' | 'customFilterType'
>;

export default function HistoryFilterModal(props: HistoryFilterModalProps) {
  return (
    <PagedTableFilterModal
      {...props}
      filterBuilderProps={historyTable.filterBuilderProps}
      customFilterType="history"
    />
  );
}
