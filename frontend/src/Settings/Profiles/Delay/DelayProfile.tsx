import classNames from 'classnames';
import React, { ReactElement, useCallback, useState } from 'react';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TagList from 'Components/TagList';
import { icons, kinds } from 'Helpers/Props';
import { useDeleteProvider } from 'Settings/useProviderSettings';
import useTags from 'Tags/useTags';
import DelayProfileModel from 'typings/DelayProfile';
import titleCase from 'Utilities/String/titleCase';
import translate from 'Utilities/String/translate';
import EditDelayProfileModal from './EditDelayProfileModal';
import {
  DEFAULT_DELAY_PROFILE_ID,
  DELAY_PROFILES_PATH,
} from './useDelayProfiles';
import styles from './DelayProfile.module.css';

function getDelay(enabled: boolean, delay: number) {
  if (!enabled) {
    return '-';
  }

  if (!delay) {
    return translate('NoDelay');
  }

  if (delay === 1) {
    return translate('OneMinute');
  }

  // TODO: use better units of time than just minutes
  return translate('DelayMinutes', { delay });
}

interface DelayProfileProps
  extends Pick<
    DelayProfileModel,
    | 'id'
    | 'enableUsenet'
    | 'enableTorrent'
    | 'preferredProtocol'
    | 'usenetDelay'
    | 'torrentDelay'
    | 'tags'
  > {
  isDragging: boolean;
  // The drag preview will not connect the drag handle.
  connectDragSource?: (node: ReactElement) => ReactElement;
}

const connectNothing = (node: ReactElement) => node;

function DelayProfile({
  id,
  enableUsenet,
  enableTorrent,
  preferredProtocol,
  usenetDelay,
  torrentDelay,
  tags,
  isDragging,
  connectDragSource = connectNothing,
}: DelayProfileProps) {
  const { deleteProvider } = useDeleteProvider<DelayProfileModel>(
    id,
    DELAY_PROFILES_PATH
  );
  const tagList = useTags();

  const [isEditDelayProfileModalOpen, setIsEditDelayProfileModalOpen] =
    useState(false);
  const [isDeleteDelayProfileModalOpen, setIsDeleteDelayProfileModalOpen] =
    useState(false);

  const handleEditDelayProfilePress = useCallback(() => {
    setIsEditDelayProfileModalOpen(true);
  }, []);

  const handleEditDelayProfileModalClose = useCallback(() => {
    setIsEditDelayProfileModalOpen(false);
  }, []);

  const handleDeleteDelayProfilePress = useCallback(() => {
    setIsEditDelayProfileModalOpen(false);
    setIsDeleteDelayProfileModalOpen(true);
  }, []);

  const handleDeleteDelayProfileModalClose = useCallback(() => {
    setIsDeleteDelayProfileModalOpen(false);
  }, []);

  const handleConfirmDeleteDelayProfile = useCallback(() => {
    deleteProvider();
  }, [deleteProvider]);

  let preferred = titleCase(translate('PreferProtocol', { preferredProtocol }));

  if (!enableUsenet) {
    preferred = translate('OnlyTorrent');
  } else if (!enableTorrent) {
    preferred = translate('OnlyUsenet');
  }

  return (
    <div
      className={classNames(
        styles.delayProfile,
        isDragging && styles.isDragging
      )}
    >
      <div className={styles.column}>{preferred}</div>

      <div className={styles.column}>{getDelay(enableUsenet, usenetDelay)}</div>

      <div className={styles.column}>
        {getDelay(enableTorrent, torrentDelay)}
      </div>

      <TagList tags={tags} tagList={tagList} />

      <div className={styles.actions}>
        <Link
          className={
            id === DEFAULT_DELAY_PROFILE_ID ? styles.editButton : undefined
          }
          onPress={handleEditDelayProfilePress}
        >
          <Icon name={icons.EDIT} />
        </Link>

        {id === DEFAULT_DELAY_PROFILE_ID
          ? null
          : connectDragSource(
              <div className={styles.dragHandle}>
                <Icon className={styles.dragIcon} name={icons.REORDER} />
              </div>
            )}
      </div>

      <EditDelayProfileModal
        id={id}
        isOpen={isEditDelayProfileModalOpen}
        onModalClose={handleEditDelayProfileModalClose}
        onDeleteDelayProfilePress={handleDeleteDelayProfilePress}
      />

      <ConfirmModal
        isOpen={isDeleteDelayProfileModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteDelayProfile')}
        message={translate('DeleteDelayProfileMessageText')}
        confirmLabel={translate('Delete')}
        onConfirm={handleConfirmDeleteDelayProfile}
        onCancel={handleDeleteDelayProfileModalClose}
      />
    </div>
  );
}

export default DelayProfile;
