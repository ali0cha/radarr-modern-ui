import React, { useCallback } from 'react';
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { inputTypes, kinds } from 'Helpers/Props';
import { useManageItem } from 'Settings/useManageItem';
import DelayProfile from 'typings/DelayProfile';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import {
  DEFAULT_DELAY_PROFILE_ID,
  DELAY_PROFILES_PATH,
  NEW_DELAY_PROFILE,
  useDelayProfiles,
} from './useDelayProfiles';
import styles from './EditDelayProfileModalContent.module.css';

const protocolOptions = [
  {
    key: 'preferUsenet',
    get value() {
      return translate('PreferUsenet');
    },
  },
  {
    key: 'preferTorrent',
    get value() {
      return translate('PreferTorrent');
    },
  },
  {
    key: 'onlyUsenet',
    get value() {
      return translate('OnlyUsenet');
    },
  },
  {
    key: 'onlyTorrent',
    get value() {
      return translate('OnlyTorrent');
    },
  },
];

export interface EditDelayProfileModalContentProps {
  id?: number;
  onModalClose: () => void;
  onDeleteDelayProfilePress?: () => void;
}

function EditDelayProfileModalContent({
  id,
  onModalClose,
  onDeleteDelayProfilePress,
}: EditDelayProfileModalContentProps) {
  const {
    isFetching: isFetchingDelayProfiles,
    isPopulated,
    error,
  } = useDelayProfiles();
  const isFetching = isFetchingDelayProfiles && !isPopulated;

  const {
    item,
    validationErrors,
    validationWarnings,
    isSaving,
    saveError,
    updateValue,
    saveItem,
  } = useManageItem<DelayProfile>(
    DELAY_PROFILES_PATH,
    id,
    NEW_DELAY_PROFILE,
    onModalClose
  );

  const {
    enableUsenet,
    enableTorrent,
    usenetDelay,
    torrentDelay,
    bypassIfHighestQuality,
    bypassIfAboveCustomFormatScore,
    minimumCustomFormatScore,
    tags,
  } = item;

  let protocol = 'preferTorrent';

  if (item.preferredProtocol.value === 'usenet') {
    protocol = 'preferUsenet';
  }

  if (!enableUsenet.value) {
    protocol = 'onlyTorrent';
  }

  if (!enableTorrent.value) {
    protocol = 'onlyUsenet';
  }

  const handleInputChange = useCallback(
    ({ name, value }: InputChanged) => {
      updateValue(
        name as keyof DelayProfile,
        value as DelayProfile[keyof DelayProfile]
      );
    },
    [updateValue]
  );

  const handleProtocolChange = useCallback(
    ({ value }: InputChanged<string>) => {
      switch (value) {
        case 'preferUsenet':
          updateValue('enableUsenet', true);
          updateValue('enableTorrent', true);
          updateValue('preferredProtocol', 'usenet');
          break;
        case 'preferTorrent':
          updateValue('enableUsenet', true);
          updateValue('enableTorrent', true);
          updateValue('preferredProtocol', 'torrent');
          break;
        case 'onlyUsenet':
          updateValue('enableUsenet', true);
          updateValue('enableTorrent', false);
          updateValue('preferredProtocol', 'usenet');
          break;
        case 'onlyTorrent':
          updateValue('enableUsenet', false);
          updateValue('enableTorrent', true);
          updateValue('preferredProtocol', 'torrent');
          break;
        default:
          throw Error(`Unknown protocol option: ${value}`);
      }
    },
    [updateValue]
  );

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {id ? translate('EditDelayProfile') : translate('AddDelayProfile')}
      </ModalHeader>

      <ModalBody>
        {isFetching ? <LoadingIndicator /> : null}

        {!isFetching && !!error ? (
          <Alert kind={kinds.DANGER}>{translate('AddDelayProfileError')}</Alert>
        ) : null}

        {!isFetching && !error ? (
          <Form
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          >
            <FormGroup>
              <FormLabel>{translate('PreferredProtocol')}</FormLabel>

              <FormInputGroup
                type={inputTypes.SELECT}
                name="protocol"
                value={protocol}
                values={protocolOptions}
                helpText={translate('ProtocolHelpText')}
                onChange={handleProtocolChange}
              />
            </FormGroup>

            {enableUsenet.value ? (
              <FormGroup>
                <FormLabel>{translate('UsenetDelay')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.NUMBER}
                  name="usenetDelay"
                  unit="minutes"
                  {...usenetDelay}
                  helpText={translate('UsenetDelayHelpText')}
                  onChange={handleInputChange}
                />
              </FormGroup>
            ) : null}

            {enableTorrent.value ? (
              <FormGroup>
                <FormLabel>{translate('TorrentDelay')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.NUMBER}
                  name="torrentDelay"
                  unit="minutes"
                  {...torrentDelay}
                  helpText={translate('TorrentDelayHelpText')}
                  onChange={handleInputChange}
                />
              </FormGroup>
            ) : null}

            <FormGroup>
              <FormLabel>{translate('BypassDelayIfHighestQuality')}</FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="bypassIfHighestQuality"
                {...bypassIfHighestQuality}
                helpText={translate('BypassDelayIfHighestQualityHelpText')}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>
                {translate('BypassDelayIfAboveCustomFormatScore')}
              </FormLabel>

              <FormInputGroup
                type={inputTypes.CHECK}
                name="bypassIfAboveCustomFormatScore"
                {...bypassIfAboveCustomFormatScore}
                helpText={translate(
                  'BypassDelayIfAboveCustomFormatScoreHelpText'
                )}
                onChange={handleInputChange}
              />
            </FormGroup>

            {bypassIfAboveCustomFormatScore.value ? (
              <FormGroup>
                <FormLabel>
                  {translate('BypassDelayIfAboveCustomFormatScoreMinimumScore')}
                </FormLabel>

                <FormInputGroup
                  type={inputTypes.NUMBER}
                  name="minimumCustomFormatScore"
                  {...minimumCustomFormatScore}
                  helpText={translate(
                    'BypassDelayIfAboveCustomFormatScoreMinimumScoreHelpText'
                  )}
                  onChange={handleInputChange}
                />
              </FormGroup>
            ) : null}

            {id === DEFAULT_DELAY_PROFILE_ID ? (
              <Alert>{translate('DefaultDelayProfileMovie')}</Alert>
            ) : (
              <FormGroup>
                <FormLabel>{translate('Tags')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.TAG}
                  name="tags"
                  {...tags}
                  helpText={translate('DelayProfileMovieTagsHelpText')}
                  onChange={handleInputChange}
                />
              </FormGroup>
            )}
          </Form>
        ) : null}
      </ModalBody>

      <ModalFooter>
        {id && id > DEFAULT_DELAY_PROFILE_ID ? (
          <Button
            className={styles.deleteButton}
            kind={kinds.DANGER}
            onPress={onDeleteDelayProfilePress}
          >
            {translate('Delete')}
          </Button>
        ) : null}

        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <SpinnerErrorButton
          isSpinning={isSaving}
          error={saveError}
          onPress={saveItem}
        >
          {translate('Save')}
        </SpinnerErrorButton>
      </ModalFooter>
    </ModalContent>
  );
}

export default EditDelayProfileModalContent;
