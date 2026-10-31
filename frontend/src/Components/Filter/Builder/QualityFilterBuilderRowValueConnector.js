import React, { useMemo } from 'react';
import { useQualityProfileSchema } from 'Settings/Profiles/Quality/useQualityProfiles';
import getQualities from 'Utilities/Quality/getQualities';
import FilterBuilderRowValue from './FilterBuilderRowValue';

function QualityFilterBuilderRowValueConnector(props) {
  const { data: schema } = useQualityProfileSchema();

  const tagList = useMemo(() => getQualities(schema?.items), [schema]);

  return (
    <FilterBuilderRowValue
      {...props}
      tagList={tagList}
    />
  );
}

export default QualityFilterBuilderRowValueConnector;
