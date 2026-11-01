import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { FieldSelectOption } from 'typings/Field';
import {
  clearOptions,
  fetchOptions,
  ProviderOptions,
  SelectOptionsProviderAction,
  useProviderOptions,
} from '../useProviderOptions';
import EnhancedSelectInput, {
  EnhancedSelectInputProps,
  EnhancedSelectInputValue,
} from './EnhancedSelectInput';

const importantFieldNames = ['baseUrl', 'apiPath', 'apiKey', 'authToken'];

function getProviderDataKey(providerData: ProviderOptions) {
  if (!providerData || !providerData.fields) {
    return null;
  }

  const fields = providerData.fields
    .filter((f) => importantFieldNames.includes(f.name))
    .map((f) => f.value);

  return fields;
}

function getSelectOptions(items: FieldSelectOption<unknown>[]) {
  if (!items) {
    return [];
  }

  return items.map((option) => {
    return {
      key: option.value,
      value: option.name,
      hint: option.hint,
      parentKey: option.parentValue,
      isDisabled: option.isDisabled,
      additionalProperties: option.additionalProperties,
    };
  });
}

export interface ProviderOptionSelectInputProps
  extends Omit<
    EnhancedSelectInputProps<EnhancedSelectInputValue<unknown>, unknown>,
    'values'
  > {
  provider: string;
  providerData: ProviderOptions;
  name: string;
  value: unknown;
  selectOptionsProviderAction: SelectOptionsProviderAction;
}

function ProviderOptionSelectInput({
  provider,
  providerData,
  selectOptionsProviderAction,
  ...otherProps
}: ProviderOptionSelectInputProps) {
  const [isRefetchRequired, setIsRefetchRequired] = useState(false);
  const previousProviderData = usePrevious(providerData);
  const { isFetching, items } = useProviderOptions<FieldSelectOption<unknown>>(
    selectOptionsProviderAction
  );
  const values = useMemo(() => getSelectOptions(items), [items]);

  const handleOpen = useCallback(() => {
    if (isRefetchRequired && selectOptionsProviderAction) {
      setIsRefetchRequired(false);

      fetchOptions({
        section: selectOptionsProviderAction,
        action: selectOptionsProviderAction,
        provider,
        providerData: providerData as Record<string, unknown>,
      });
    }
  }, [isRefetchRequired, provider, providerData, selectOptionsProviderAction]);

  useEffect(() => {
    if (selectOptionsProviderAction) {
      fetchOptions({
        section: selectOptionsProviderAction,
        action: selectOptionsProviderAction,
        provider,
        providerData: providerData as Record<string, unknown>,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectOptionsProviderAction]);

  useEffect(() => {
    if (!previousProviderData) {
      return;
    }

    const prevKey = getProviderDataKey(previousProviderData);
    const nextKey = getProviderDataKey(providerData);

    if (!isEqual(prevKey, nextKey)) {
      setIsRefetchRequired(true);
    }
  }, [providerData, previousProviderData, setIsRefetchRequired]);

  useEffect(() => {
    return () => {
      if (selectOptionsProviderAction) {
        clearOptions(selectOptionsProviderAction);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EnhancedSelectInput
      {...otherProps}
      isFetching={isFetching}
      values={values}
      onOpen={handleOpen}
    />
  );
}

export default ProviderOptionSelectInput;
