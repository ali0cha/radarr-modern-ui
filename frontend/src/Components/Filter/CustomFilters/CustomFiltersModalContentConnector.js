import React from 'react';
import { useDeleteCustomFilter } from 'Components/Filter/useCustomFilters';
import CustomFiltersModalContent from './CustomFiltersModalContent';

function CustomFiltersModalContentConnector(props) {
  const { deleteCustomFilter, isDeleting, deleteError } = useDeleteCustomFilter();

  return (
    <CustomFiltersModalContent
      {...props}
      isDeleting={isDeleting}
      deleteError={deleteError}
      dispatchDeleteCustomFilter={deleteCustomFilter}
    />
  );
}

export default CustomFiltersModalContentConnector;
