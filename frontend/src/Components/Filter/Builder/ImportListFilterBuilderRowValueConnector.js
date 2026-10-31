import React, { useMemo } from 'react';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import FilterBuilderRowValue from './FilterBuilderRowValue';

function ImportListFilterBuilderRowValueConnector(props) {
  const { items } = useImportLists();

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

export default ImportListFilterBuilderRowValueConnector;
