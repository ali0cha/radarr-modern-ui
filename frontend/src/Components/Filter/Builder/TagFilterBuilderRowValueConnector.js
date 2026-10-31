import React, { useMemo } from 'react';
import useTags from 'Tags/useTags';
import FilterBuilderRowValue from './FilterBuilderRowValue';

function TagFilterBuilderRowValueConnector(props) {
  const tags = useTags();

  const tagList = useMemo(() => {
    return tags.map((tag) => {
      const {
        id,
        label: name
      } = tag;

      return {
        id,
        name
      };
    });
  }, [tags]);

  return (
    <FilterBuilderRowValue
      {...props}
      tagList={tagList}
    />
  );
}

export default TagFilterBuilderRowValueConnector;
