import React from 'react';
import { useAppStore } from 'App/useAppStore';
import { useRestart } from 'System/useSystem';
import RestoreBackupModalContent from './RestoreBackupModalContent';
import { useRestoreBackup } from './useBackups';

function RestoreBackupModalContentConnector(props) {
  const isRestarting = useAppStore((state) => state.isRestarting);
  const { restoreBackup, isRestoring, restoreError } = useRestoreBackup();
  const restart = useRestart();

  return (
    <RestoreBackupModalContent
      {...props}
      isRestoring={isRestoring}
      restoreError={restoreError}
      isRestarting={isRestarting}
      onRestorePress={restoreBackup}
      dispatchRestart={restart}
    />
  );
}

export default RestoreBackupModalContentConnector;
