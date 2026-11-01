import React from 'react';
import PagedTableFilterModal from 'Components/Filter/PagedTableFilterModal';
import { queueTable } from './useQueue';

// The filter menu passes it the state of the filters
type QueueFilterModalProps = Omit<
  React.ComponentProps<typeof PagedTableFilterModal>,
  'filterBuilderProps' | 'customFilterType'
>;

export default function QueueFilterModal(props: QueueFilterModalProps) {
  return (
    <PagedTableFilterModal
      {...props}
      filterBuilderProps={queueTable.filterBuilderProps}
      customFilterType="queue"
    />
  );
}
