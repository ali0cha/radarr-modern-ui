import React from 'react';
import PagedTableFilterModal from 'Components/Filter/PagedTableFilterModal';
import { blocklistTable } from './useBlocklist';

// The filter menu passes it the state of the filters
type BlocklistFilterModalProps = Omit<
  React.ComponentProps<typeof PagedTableFilterModal>,
  'filterBuilderProps' | 'customFilterType'
>;

export default function BlocklistFilterModal(props: BlocklistFilterModalProps) {
  return (
    <PagedTableFilterModal
      {...props}
      filterBuilderProps={blocklistTable.filterBuilderProps}
      customFilterType="blocklist"
    />
  );
}
