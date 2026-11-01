import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Icon from 'Components/Icon';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { icons } from 'Helpers/Props';
import { InputChanged } from 'typings/inputs';
import FormInputButton from './FormInputButton';
import TextInput from './TextInput';
import {
  getCaptchaCookie,
  refreshCaptcha,
  resetCaptcha,
  useCaptchaStore,
} from './useCaptcha';
import styles from './CaptchaInput.module.css';

export interface CaptchaInputProps {
  className?: string;
  name: string;
  value?: string;
  provider: string;
  providerData: Record<string, unknown>;
  hasError?: boolean;
  hasWarning?: boolean;
  onChange: (change: InputChanged<string>) => unknown;
}

function CaptchaInput({
  className = styles.input,
  name,
  value = '',
  provider,
  providerData,
  hasError,
  hasWarning,
  onChange,
}: CaptchaInputProps) {
  const { token, refreshing, siteKey, secretToken } = useCaptchaStore();
  const previousToken = usePrevious(token);

  const handleCaptchaChange = useCallback(
    (token: string | null) => {
      // If the captcha has expired `captchaResponse` will be null.
      // In the event it's null don't try to get the captchaCookie.
      // TODO: Should we clear the cookie? or reset the captcha?

      if (!token) {
        return;
      }

      getCaptchaCookie({
        provider,
        providerData,
        captchaResponse: token,
      });
    },
    [provider, providerData]
  );

  const handleRefreshPress = useCallback(() => {
    refreshCaptcha({ provider, providerData });
  }, [provider, providerData]);

  useEffect(() => {
    if (token && token !== previousToken) {
      onChange({ name, value: token });
    }
  }, [name, token, previousToken, onChange]);

  useEffect(() => {
    resetCaptcha();
  }, []);

  return (
    <div>
      <div className={styles.captchaInputWrapper}>
        <TextInput
          className={classNames(
            className,
            styles.hasButton,
            hasError && styles.hasError,
            hasWarning && styles.hasWarning
          )}
          name={name}
          value={value}
          onChange={onChange}
        />

        <FormInputButton onPress={handleRefreshPress}>
          <Icon name={icons.REFRESH} isSpinning={refreshing} />
        </FormInputButton>
      </div>

      {siteKey && secretToken ? (
        <div className={styles.recaptchaWrapper}>
          <ReCAPTCHA
            sitekey={siteKey}
            stoken={secretToken}
            onChange={handleCaptchaChange}
          />
        </div>
      ) : null}
    </div>
  );
}

export default CaptchaInput;
