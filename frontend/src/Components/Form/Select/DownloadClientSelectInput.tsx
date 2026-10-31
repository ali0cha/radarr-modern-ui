import React, { useMemo } from 'react';
import { useDownloadClients } from 'Settings/DownloadClients/useDownloadClients';
import { Protocol } from 'typings/DownloadClient';
import { EnhancedSelectInputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import EnhancedSelectInput, {
  EnhancedSelectInputProps,
  EnhancedSelectInputValue,
} from './EnhancedSelectInput';

export interface DownloadClientSelectInputProps
  extends Omit<
    EnhancedSelectInputProps<EnhancedSelectInputValue<number>, number>,
    'values'
  > {
  name: string;
  value: number;
  includeAny?: boolean;
  protocol?: Protocol;
  onChange: (change: EnhancedSelectInputChanged<number>) => void;
}

function DownloadClientSelectInput({
  includeAny = false,
  protocol = 'torrent',
  ...otherProps
}: DownloadClientSelectInputProps) {
  const { items, isFetching } = useDownloadClients();

  const values = useMemo(() => {
    const downloadClientValues = items
      .filter((item) => item.protocol === protocol)
      .map((downloadClient) => {
        return {
          key: downloadClient.id,
          value: downloadClient.name,
          hint: `(${downloadClient.id})`,
        };
      });

    if (includeAny) {
      downloadClientValues.unshift({
        key: 0,
        value: `(${translate('Any')})`,
        hint: '',
      });
    }

    return downloadClientValues;
  }, [items, protocol, includeAny]);

  return (
    <EnhancedSelectInput
      {...otherProps}
      isFetching={isFetching}
      values={values}
    />
  );
}

export default DownloadClientSelectInput;
