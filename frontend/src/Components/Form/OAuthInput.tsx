import React, { useCallback, useEffect } from 'react';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import { kinds } from 'Helpers/Props';
import { InputOnChange } from 'typings/inputs';
import { resetOAuth, startOAuth, useOAuthStore } from './useOAuth';

export interface OAuthInputProps {
  label?: string;
  name: string;
  provider: string;
  providerData: Record<string, unknown>;
  onChange: InputOnChange<unknown>;
}

function OAuthInput({
  label = 'Start OAuth',
  name,
  provider,
  providerData,
  onChange,
}: OAuthInputProps) {
  const { authorizing, error, result } = useOAuthStore();

  const handlePress = useCallback(() => {
    startOAuth({ name, provider, providerData });
  }, [name, provider, providerData]);

  useEffect(() => {
    if (!result) {
      return;
    }

    Object.keys(result).forEach((key) => {
      onChange({ name: key, value: result[key] });
    });
  }, [result, onChange]);

  useEffect(() => {
    return () => {
      resetOAuth();
    };
  }, []);

  return (
    <div>
      <SpinnerErrorButton
        kind={kinds.PRIMARY}
        isSpinning={authorizing}
        error={error}
        onPress={handlePress}
      >
        {label}
      </SpinnerErrorButton>
    </div>
  );
}

export default OAuthInput;
