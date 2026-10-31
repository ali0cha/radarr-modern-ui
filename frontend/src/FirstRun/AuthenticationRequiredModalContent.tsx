import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Alert from 'Components/Alert';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { inputTypes, kinds } from 'Helpers/Props';
import AuthenticationMethodSettings from 'Settings/General/AuthenticationMethodSettings';
import {
  authenticationMethodOptions,
  authenticationRequiredOptions,
} from 'Settings/General/SecuritySettings';
import { useManageSettings } from 'Settings/useSettings';
import { fetchStatus } from 'Store/Actions/systemActions';
import { InputChanged } from 'typings/inputs';
import General from 'typings/Settings/General';
import translate from 'Utilities/String/translate';
import styles from './AuthenticationRequiredModalContent.module.css';

const PATH = '/config/host';

function onModalClose() {
  // No-op
}

export default function AuthenticationRequiredModalContent() {
  const {
    isPopulated,
    error,
    isSaving,
    saveError,
    settings,
    updateSetting,
    saveSettings,
  } = useManageSettings<General>(PATH);
  const dispatch = useDispatch();

  const {
    authenticationMethod,
    authenticationRequired,
    username,
    password,
    passwordConfirmation,
    allowedHosts,
    oidcAuthority,
    oidcClientId,
    oidcClientSecret,
    oidcUserIdentifier,
    oidcScopes,
  } = settings;

  const wasSaving = usePrevious(isSaving);

  const onInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateSetting(name as keyof General, value as General[keyof General]);
    },
    [updateSetting]
  );

  const authenticationEnabled =
    authenticationMethod && authenticationMethod.value !== 'none';

  useEffect(() => {
    if (isSaving || !wasSaving || saveError) {
      return;
    }

    dispatch(fetchStatus());
  }, [isSaving, wasSaving, saveError, dispatch]);

  const onPress = useCallback(() => {
    saveSettings();
  }, [saveSettings]);

  return (
    <ModalContent showCloseButton={false} onModalClose={onModalClose}>
      <ModalHeader>{translate('AuthenticationRequired')}</ModalHeader>

      <ModalBody>
        <Alert className={styles.authRequiredAlert} kind={kinds.WARNING}>
          {translate('AuthenticationRequiredWarning')}
        </Alert>

        {isPopulated && !error ? (
          <div>
            <FormGroup>
              <FormLabel>{translate('AuthenticationMethod')}</FormLabel>

              <FormInputGroup
                type={inputTypes.SELECT}
                name="authenticationMethod"
                values={authenticationMethodOptions}
                helpText={translate('AuthenticationMethodHelpText')}
                helpTextWarning={
                  authenticationMethod.value === 'none'
                    ? translate('AuthenticationMethodHelpTextWarning')
                    : undefined
                }
                helpLink="https://wiki.servarr.com/radarr/faq#forced-authentication"
                onChange={onInputChange}
                {...authenticationMethod}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{translate('AuthenticationRequired')}</FormLabel>

              <FormInputGroup
                type={inputTypes.SELECT}
                name="authenticationRequired"
                values={authenticationRequiredOptions}
                helpText={translate('AuthenticationRequiredHelpText')}
                onChange={onInputChange}
                {...authenticationRequired}
              />
            </FormGroup>

            <AuthenticationMethodSettings
              authenticationMethod={authenticationMethod}
              username={username}
              password={password}
              passwordConfirmation={passwordConfirmation}
              oidcAuthority={oidcAuthority}
              oidcClientId={oidcClientId}
              oidcClientSecret={oidcClientSecret}
              oidcUserIdentifier={oidcUserIdentifier}
              oidcScopes={oidcScopes}
              showValidationWarnings={true}
              onInputChange={onInputChange}
            />

            <FormGroup>
              <FormLabel>{translate('AllowedHosts')}</FormLabel>

              <FormInputGroup
                type={inputTypes.TEXT}
                name="allowedHosts"
                helpText={translate('AllowedHostsHelpText')}
                helpTextWarning={translate('RestartRequiredHelpTextWarning')}
                helpLink="https://wiki.servarr.com/radarr/settings#host"
                onChange={onInputChange}
                {...allowedHosts}
              />
            </FormGroup>
          </div>
        ) : null}

        {!isPopulated && !error ? <LoadingIndicator /> : null}
      </ModalBody>

      <ModalFooter>
        <SpinnerErrorButton
          kind={kinds.PRIMARY}
          isSpinning={isSaving}
          isDisabled={!authenticationEnabled}
          error={saveError}
          onPress={onPress}
        >
          {translate('Save')}
        </SpinnerErrorButton>
      </ModalFooter>
    </ModalContent>
  );
}
