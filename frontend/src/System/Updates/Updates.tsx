import React, { useCallback, useMemo, useState } from 'react';
import { useAppStore } from 'App/useAppStore';
import * as commandNames from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import SpinnerButton from 'Components/Link/SpinnerButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import { icons, kinds } from 'Helpers/Props';
import useUISettings from 'Settings/UI/useUISettings';
import { useSettings } from 'Settings/useSettings';
import { useUpdates } from 'System/useSystem';
import useSystemStatus from 'System/useSystemStatus';
import General, { UpdateMechanism } from 'typings/Settings/General';
import formatDate from 'Utilities/Date/formatDate';
import formatDateTime from 'Utilities/Date/formatDateTime';
import translate from 'Utilities/String/translate';
import UpdateChanges from './UpdateChanges';
import styles from './Updates.module.css';

const VERSION_REGEX = /\d+\.\d+\.\d+\.\d+/i;

function Updates() {
  const currentVersion = useAppStore((state) => state.version);
  const { packageUpdateMechanismMessage } = useSystemStatus();
  const { shortDateFormat, longDateFormat, timeFormat } = useUISettings();
  const isInstallingUpdate = useCommandExecuting(
    commandNames.APPLICATION_UPDATE
  );

  const {
    isFetching: isFetchingUpdates,
    isPopulated: isUpdatesPopulated,
    error: updatesError,
    items,
  } = useUpdates();

  const {
    data: generalSettings,
    isFetching: isFetchingGeneralSettings,
    isSuccess: isGeneralSettingsPopulated,
    error: generalSettingsError,
  } = useSettings<General>('/config/host');

  const isFetching = isFetchingUpdates || isFetchingGeneralSettings;
  const isPopulated = isUpdatesPopulated && isGeneralSettingsPopulated;
  const { updateMechanism } = generalSettings;

  const [isMajorUpdateModalOpen, setIsMajorUpdateModalOpen] = useState(false);
  const hasError = !!(updatesError || generalSettingsError);
  const hasUpdates = isPopulated && !hasError && items.length > 0;
  const noUpdates = isPopulated && !hasError && !items.length;

  const externalUpdaterPrefix = translate('UpdateAppDirectlyLoadError');
  const externalUpdaterMessages: Partial<Record<UpdateMechanism, string>> = {
    external: translate('ExternalUpdater'),
    apt: translate('AptUpdater'),
    docker: translate('DockerUpdater'),
  };

  const { isMajorUpdate, hasUpdateToInstall } = useMemo(() => {
    const majorVersion = parseInt(
      currentVersion.match(VERSION_REGEX)?.[0] ?? '0'
    );

    const latestVersion = items[0]?.version;
    const latestMajorVersion = parseInt(
      latestVersion?.match(VERSION_REGEX)?.[0] ?? '0'
    );

    return {
      isMajorUpdate: latestMajorVersion > majorVersion,
      hasUpdateToInstall: items.some(
        (update) => update.installable && update.latest
      ),
    };
  }, [currentVersion, items]);

  const noUpdateToInstall = hasUpdates && !hasUpdateToInstall;

  const handleInstallLatestPress = useCallback(() => {
    if (isMajorUpdate) {
      setIsMajorUpdateModalOpen(true);
    } else {
      executeCommand({ name: commandNames.APPLICATION_UPDATE });
    }
  }, [isMajorUpdate, setIsMajorUpdateModalOpen]);

  const handleInstallLatestMajorVersionPress = useCallback(() => {
    setIsMajorUpdateModalOpen(false);

    executeCommand({
      name: commandNames.APPLICATION_UPDATE,
      installMajorUpdate: true,
    });
  }, [setIsMajorUpdateModalOpen]);

  const handleCancelMajorVersionPress = useCallback(() => {
    setIsMajorUpdateModalOpen(false);
  }, [setIsMajorUpdateModalOpen]);

  return (
    <PageContent title={translate('Updates')}>
      <PageContentBody>
        {isPopulated || hasError ? null : <LoadingIndicator />}

        {noUpdates ? (
          <Alert kind={kinds.INFO}>{translate('NoUpdatesAreAvailable')}</Alert>
        ) : null}

        {hasUpdateToInstall ? (
          <div className={styles.messageContainer}>
            {updateMechanism === 'builtIn' || updateMechanism === 'script' ? (
              <SpinnerButton
                kind={kinds.PRIMARY}
                isSpinning={isInstallingUpdate}
                onPress={handleInstallLatestPress}
              >
                {translate('InstallLatest')}
              </SpinnerButton>
            ) : (
              <>
                <Icon name={icons.WARNING} kind={kinds.WARNING} size={30} />

                <div className={styles.message}>
                  {externalUpdaterPrefix}{' '}
                  <InlineMarkdown
                    data={
                      packageUpdateMechanismMessage ||
                      externalUpdaterMessages[updateMechanism] ||
                      externalUpdaterMessages.external
                    }
                  />
                </div>
              </>
            )}

            {isFetching ? (
              <LoadingIndicator className={styles.loading} size={20} />
            ) : null}
          </div>
        ) : null}

        {noUpdateToInstall && (
          <div className={styles.messageContainer}>
            <Icon
              className={styles.upToDateIcon}
              name={icons.CHECK_CIRCLE}
              size={30}
            />
            <div className={styles.message}>{translate('OnLatestVersion')}</div>

            {isFetching && (
              <LoadingIndicator className={styles.loading} size={20} />
            )}
          </div>
        )}

        {hasUpdates && (
          <div>
            {items.map((update) => {
              return (
                <div key={update.version} className={styles.update}>
                  <div className={styles.info}>
                    <div className={styles.version}>{update.version}</div>
                    <div className={styles.space}>&mdash;</div>
                    <div
                      className={styles.date}
                      title={formatDateTime(
                        update.releaseDate,
                        longDateFormat,
                        timeFormat
                      )}
                    >
                      {formatDate(update.releaseDate, shortDateFormat)}
                    </div>

                    {update.branch === 'master' ? null : (
                      <Label className={styles.label}>{update.branch}</Label>
                    )}

                    {update.version === currentVersion ? (
                      <Label
                        className={styles.label}
                        kind={kinds.SUCCESS}
                        title={formatDateTime(
                          update.installedOn,
                          longDateFormat,
                          timeFormat
                        )}
                      >
                        {translate('CurrentlyInstalled')}
                      </Label>
                    ) : null}

                    {update.version !== currentVersion && update.installedOn ? (
                      <Label
                        className={styles.label}
                        kind={kinds.INVERSE}
                        title={formatDateTime(
                          update.installedOn,
                          longDateFormat,
                          timeFormat
                        )}
                      >
                        {translate('PreviouslyInstalled')}
                      </Label>
                    ) : null}
                  </div>

                  {update.changes ? (
                    <div>
                      <UpdateChanges
                        title={translate('New')}
                        changes={update.changes.new}
                      />

                      <UpdateChanges
                        title={translate('Fixed')}
                        changes={update.changes.fixed}
                      />
                    </div>
                  ) : (
                    <div>{translate('MaintenanceRelease')}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {updatesError ? (
          <Alert kind={kinds.WARNING}>
            {translate('FailedToFetchUpdates')}
          </Alert>
        ) : null}

        {generalSettingsError ? (
          <Alert kind={kinds.DANGER}>
            {translate('FailedToUpdateSettings')}
          </Alert>
        ) : null}

        <ConfirmModal
          isOpen={isMajorUpdateModalOpen}
          kind={kinds.WARNING}
          title={translate('InstallMajorVersionUpdate')}
          message={
            <div>
              <div>{translate('InstallMajorVersionUpdateMessage')}</div>
              <div>
                <InlineMarkdown
                  data={translate('InstallMajorVersionUpdateMessageLink', {
                    domain: 'radarr.video',
                    url: 'https://radarr.video/#downloads',
                  })}
                />
              </div>
            </div>
          }
          confirmLabel={translate('Install')}
          onConfirm={handleInstallLatestMajorVersionPress}
          onCancel={handleCancelMajorVersionPress}
        />
      </PageContentBody>
    </PageContent>
  );
}

export default Updates;
