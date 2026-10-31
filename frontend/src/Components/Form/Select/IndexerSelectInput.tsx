import React, { useMemo } from 'react';
import { useIndexers } from 'Settings/Indexers/useIndexers';
import { EnhancedSelectInputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import EnhancedSelectInput from './EnhancedSelectInput';

export interface IndexerSelectInputProps {
  name: string;
  value: number;
  includeAny?: boolean;
  onChange: (change: EnhancedSelectInputChanged<number>) => void;
}

function IndexerSelectInput({
  name,
  value,
  includeAny = false,
  onChange,
}: IndexerSelectInputProps) {
  const { items, isFetching } = useIndexers();

  const values = useMemo(() => {
    const indexerValues = items.map((indexer) => {
      return {
        key: indexer.id,
        value: indexer.name,
      };
    });

    if (includeAny) {
      indexerValues.unshift({
        key: 0,
        value: `(${translate('Any')})`,
      });
    }

    return indexerValues;
  }, [items, includeAny]);

  return (
    <EnhancedSelectInput
      name={name}
      value={value}
      isFetching={isFetching}
      values={values}
      onChange={onChange}
    />
  );
}

export default IndexerSelectInput;
