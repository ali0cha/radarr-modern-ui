import React, { useCallback, useEffect, useMemo } from 'react';
import { useQualityProfiles } from 'Settings/Profiles/Quality/useQualityProfiles';
import { EnhancedSelectInputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import EnhancedSelectInput, {
  EnhancedSelectInputProps,
  EnhancedSelectInputValue,
} from './EnhancedSelectInput';

export interface QualityProfileSelectInputProps
  extends Omit<
    EnhancedSelectInputProps<
      EnhancedSelectInputValue<number | string>,
      number | string
    >,
    'values'
  > {
  name: string;
  includeNoChange?: boolean;
  includeNoChangeDisabled?: boolean;
  includeMixed?: boolean;
}

function QualityProfileSelectInput({
  name,
  value,
  includeNoChange = false,
  includeNoChangeDisabled = true,
  includeMixed = false,
  onChange,
  ...otherProps
}: QualityProfileSelectInputProps) {
  const { items } = useQualityProfiles();

  const values = useMemo(() => {
    const profileValues: EnhancedSelectInputValue<number | string>[] =
      items.map((qualityProfile) => {
        return {
          key: qualityProfile.id,
          value: qualityProfile.name,
        };
      });

    if (includeNoChange) {
      profileValues.unshift({
        key: 'noChange',
        get value() {
          return translate('NoChange');
        },
        isDisabled: includeNoChangeDisabled,
      });
    }

    if (includeMixed) {
      profileValues.unshift({
        key: 'mixed',
        get value() {
          return `(${translate('Mixed')})`;
        },
        isDisabled: true,
      });
    }

    return profileValues;
  }, [items, includeNoChange, includeNoChangeDisabled, includeMixed]);

  const handleChange = useCallback(
    ({ value }: EnhancedSelectInputChanged<string | number>) => {
      onChange({ name, value });
    },
    [name, onChange]
  );

  useEffect(() => {
    if (
      !value ||
      !values.some((option) => option.key === value || option.key === value)
    ) {
      const firstValue = values.find(
        (option) => typeof option.key === 'number'
      );

      if (firstValue) {
        onChange({ name, value: firstValue.key });
      }
    }
  }, [name, value, values, onChange]);

  return (
    <EnhancedSelectInput
      {...otherProps}
      name={name}
      value={value}
      values={values}
      onChange={handleChange}
    />
  );
}

export default QualityProfileSelectInput;
