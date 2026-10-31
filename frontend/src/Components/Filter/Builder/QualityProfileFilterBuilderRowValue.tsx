import React, { useMemo } from 'react';
import FilterBuilderRowValueProps from 'Components/Filter/Builder/FilterBuilderRowValueProps';
import { useQualityProfiles } from 'Settings/Profiles/Quality/useQualityProfiles';
import sortByProp from 'Utilities/Array/sortByProp';
import FilterBuilderRowValue from './FilterBuilderRowValue';

function QualityProfileFilterBuilderRowValue(
  props: FilterBuilderRowValueProps
) {
  const { items } = useQualityProfiles();

  const tagList = useMemo(
    () => items.map(({ id, name }) => ({ id, name })).sort(sortByProp('name')),
    [items]
  );

  return <FilterBuilderRowValue {...props} tagList={tagList} />;
}

export default QualityProfileFilterBuilderRowValue;
