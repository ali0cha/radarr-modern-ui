import PropTypes from 'prop-types';
import React from 'react';
import { useDeleteCustomFilter, useSaveCustomFilter } from 'Components/Filter/useCustomFilters';
import FilterBuilderModalContent from './FilterBuilderModalContent';

function FilterBuilderModalContentConnector({ customFilters, id, ...otherProps }) {
  const { saveCustomFilter, isSaving, saveError } = useSaveCustomFilter();
  const { deleteCustomFilter } = useDeleteCustomFilter();

  const customFilter = id ? customFilters.find((c) => c.id === id) : undefined;

  return (
    <FilterBuilderModalContent
      {...otherProps}
      id={customFilter ? customFilter.id : undefined}
      label={customFilter ? customFilter.label : ''}
      filters={customFilter ? customFilter.filters : []}
      customFilters={customFilters}
      isSaving={isSaving}
      saveError={saveError}
      onSaveCustomFilterPress={saveCustomFilter}
      dispatchDeleteCustomFilter={deleteCustomFilter}
    />
  );
}

FilterBuilderModalContentConnector.propTypes = {
  id: PropTypes.number,
  customFilters: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default FilterBuilderModalContentConnector;
