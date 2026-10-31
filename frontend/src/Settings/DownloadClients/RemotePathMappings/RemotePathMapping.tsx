import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';
import { icons, kinds } from 'Helpers/Props';
import { useDeleteProvider } from 'Settings/useProviderSettings';
import RemotePathMappingModel from 'typings/RemotePathMapping';
import translate from 'Utilities/String/translate';
import EditRemotePathMappingModal from './EditRemotePathMappingModal';
import { REMOTE_PATH_MAPPINGS_PATH } from './useRemotePathMappings';
import styles from './RemotePathMapping.module.css';

function RemotePathMapping(props: RemotePathMappingModel) {
  const { id, host, remotePath, localPath } = props;

  const { deleteProvider } = useDeleteProvider<RemotePathMappingModel>(
    id,
    REMOTE_PATH_MAPPINGS_PATH
  );

  const [
    isEditRemotePathMappingModalOpen,
    setEditRemotePathMappingModalOpen,
    setEditRemotePathMappingModalClosed,
  ] = useModalOpenState(false);

  const [
    isDeleteRemotePathMappingModalOpen,
    setDeleteRemotePathMappingModalOpen,
    setDeleteRemotePathMappingModalClosed,
  ] = useModalOpenState(false);

  const handleDeletePress = useCallback(() => {
    setEditRemotePathMappingModalClosed();
    setDeleteRemotePathMappingModalOpen();
  }, [
    setEditRemotePathMappingModalClosed,
    setDeleteRemotePathMappingModalOpen,
  ]);

  return (
    <div className={styles.remotePathMapping}>
      <div className={styles.host}>{host}</div>
      <div className={styles.path}>{remotePath}</div>
      <div className={styles.path}>{localPath}</div>

      <div className={styles.actions}>
        <Link onPress={setEditRemotePathMappingModalOpen}>
          <Icon name={icons.EDIT} />
        </Link>
      </div>

      <EditRemotePathMappingModal
        id={id}
        isOpen={isEditRemotePathMappingModalOpen}
        onModalClose={setEditRemotePathMappingModalClosed}
        onDeleteRemotePathMappingPress={handleDeletePress}
      />

      <ConfirmModal
        isOpen={isDeleteRemotePathMappingModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteRemotePathMapping')}
        message={translate('DeleteRemotePathMappingMessageText')}
        confirmLabel={translate('Delete')}
        onConfirm={deleteProvider}
        onCancel={setDeleteRemotePathMappingModalClosed}
      />
    </div>
  );
}

export default RemotePathMapping;
