import React, { useMemo } from 'react';
import { useIndexers } from 'Settings/Indexers/useIndexers';
import FilterBuilderRowValue from './FilterBuilderRowValue';

function IndexerFilterBuilderRowValueConnector(props) {
  const { items } = useIndexers();

  const tagList = useMemo(() => {
    return items.map((item) => {
      return {
        id: item.id,
        name: item.name
      };
    });
  }, [items]);

  return (
    <FilterBuilderRowValue
      {...props}
      tagList={tagList}
    />
  );
}

export default IndexerFilterBuilderRowValueConnector;
