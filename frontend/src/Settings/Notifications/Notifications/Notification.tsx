import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import Label from 'Components/Label';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TagList from 'Components/TagList';
import { kinds } from 'Helpers/Props';
import { useDeleteProvider } from 'Settings/useProviderSettings';
import useTags from 'Tags/useTags';
import NotificationModel from 'typings/Notification';
import translate from 'Utilities/String/translate';
import { NOTIFICATIONS_PATH } from '../useNotifications';
import EditNotificationModal from './EditNotificationModal';
import styles from './Notification.module.css';

type NotificationProps = NotificationModel;

function Notification({
  id,
  name,
  onGrab,
  onDownload,
  onUpgrade,
  onRename,
  onMovieAdded,
  onMovieDelete,
  onMovieFileDelete,
  onMovieFileDeleteForUpgrade,
  onHealthIssue,
  onHealthRestored,
  onApplicationUpdate,
  onManualInteractionRequired,
  supportsOnGrab,
  supportsOnDownload,
  supportsOnUpgrade,
  supportsOnRename,
  supportsOnMovieAdded,
  supportsOnMovieDelete,
  supportsOnMovieFileDelete,
  supportsOnMovieFileDeleteForUpgrade,
  supportsOnHealthIssue,
  supportsOnHealthRestored,
  supportsOnApplicationUpdate,
  supportsOnManualInteractionRequired,
  tags,
}: NotificationProps) {
  const { deleteProvider } = useDeleteProvider<NotificationModel>(
    id,
    NOTIFICATIONS_PATH
  );
  const tagList = useTags();

  const [isEditNotificationModalOpen, setIsEditNotificationModalOpen] =
    useState(false);
  const [isDeleteNotificationModalOpen, setIsDeleteNotificationModalOpen] =
    useState(false);

  const handleEditNotificationPress = useCallback(() => {
    setIsEditNotificationModalOpen(true);
  }, []);

  const handleEditNotificationModalClose = useCallback(() => {
    setIsEditNotificationModalOpen(false);
  }, []);

  const handleDeleteNotificationPress = useCallback(() => {
    setIsEditNotificationModalOpen(false);
    setIsDeleteNotificationModalOpen(true);
  }, []);

  const handleDeleteNotificationModalClose = useCallback(() => {
    setIsDeleteNotificationModalOpen(false);
  }, []);

  const handleConfirmDeleteNotification = useCallback(() => {
    deleteProvider();
  }, [deleteProvider]);

  return (
    <Card
      className={styles.notification}
      overlayContent={true}
      onPress={handleEditNotificationPress}
    >
      <div className={styles.name}>{name}</div>

      {supportsOnGrab && onGrab ? (
        <Label kind={kinds.SUCCESS}>{translate('OnGrab')}</Label>
      ) : null}

      {supportsOnDownload && onDownload ? (
        <Label kind={kinds.SUCCESS}>{translate('OnFileImport')}</Label>
      ) : null}

      {supportsOnUpgrade && onDownload && onUpgrade ? (
        <Label kind={kinds.SUCCESS}>{translate('OnFileUpgrade')}</Label>
      ) : null}

      {supportsOnRename && onRename ? (
        <Label kind={kinds.SUCCESS}>{translate('OnRename')}</Label>
      ) : null}

      {supportsOnMovieAdded && onMovieAdded ? (
        <Label kind={kinds.SUCCESS}>{translate('OnMovieAdded')}</Label>
      ) : null}

      {supportsOnHealthIssue && onHealthIssue ? (
        <Label kind={kinds.SUCCESS}>{translate('OnHealthIssue')}</Label>
      ) : null}

      {supportsOnHealthRestored && onHealthRestored ? (
        <Label kind={kinds.SUCCESS}>{translate('OnHealthRestored')}</Label>
      ) : null}

      {supportsOnApplicationUpdate && onApplicationUpdate ? (
        <Label kind={kinds.SUCCESS}>{translate('OnApplicationUpdate')}</Label>
      ) : null}

      {supportsOnMovieDelete && onMovieDelete ? (
        <Label kind={kinds.SUCCESS}>{translate('OnMovieDelete')}</Label>
      ) : null}

      {supportsOnMovieFileDelete && onMovieFileDelete ? (
        <Label kind={kinds.SUCCESS}>{translate('OnMovieFileDelete')}</Label>
      ) : null}

      {supportsOnMovieFileDeleteForUpgrade &&
      onMovieFileDelete &&
      onMovieFileDeleteForUpgrade ? (
        <Label kind={kinds.SUCCESS}>
          {translate('OnMovieFileDeleteForUpgrade')}
        </Label>
      ) : null}

      {supportsOnManualInteractionRequired && onManualInteractionRequired ? (
        <Label kind={kinds.SUCCESS}>
          {translate('OnManualInteractionRequired')}
        </Label>
      ) : null}

      {!onGrab &&
      !onDownload &&
      !onRename &&
      !onHealthIssue &&
      !onHealthRestored &&
      !onApplicationUpdate &&
      !onMovieAdded &&
      !onMovieDelete &&
      !onMovieFileDelete &&
      !onManualInteractionRequired ? (
        <Label kind={kinds.DISABLED} outline={true}>
          {translate('Disabled')}
        </Label>
      ) : null}

      <TagList tags={tags} tagList={tagList} />

      <EditNotificationModal
        id={id}
        isOpen={isEditNotificationModalOpen}
        onModalClose={handleEditNotificationModalClose}
        onDeleteNotificationPress={handleDeleteNotificationPress}
      />

      <ConfirmModal
        isOpen={isDeleteNotificationModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteNotification')}
        message={translate('DeleteNotificationMessageText', { name })}
        confirmLabel={translate('Delete')}
        onConfirm={handleConfirmDeleteNotification}
        onCancel={handleDeleteNotificationModalClose}
      />
    </Card>
  );
}

export default Notification;
