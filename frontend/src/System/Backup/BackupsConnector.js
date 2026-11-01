import React, { useCallback, useEffect } from 'react';
import * as commandNames from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import usePrevious from 'Helpers/Hooks/usePrevious';
import Backups from './Backups';
import { useBackups, useDeleteBackup } from './useBackups';

function BackupsConnector() {
  const { items, isFetching, isPopulated, error, refetch } = useBackups();
  const { deleteBackup } = useDeleteBackup();
  const backupExecuting = useCommandExecuting(commandNames.BACKUP);
  const wasBackupExecuting = usePrevious(backupExecuting);

  useEffect(() => {
    if (wasBackupExecuting && !backupExecuting) {
      refetch();
    }
  }, [wasBackupExecuting, backupExecuting, refetch]);

  const handleBackupPress = useCallback(() => {
    executeCommand({
      name: commandNames.BACKUP
    });
  }, []);

  return (
    <Backups
      isFetching={isFetching}
      isPopulated={isPopulated}
      error={error}
      items={items}
      backupExecuting={backupExecuting}
      onDeleteBackupPress={deleteBackup}
      onBackupPress={handleBackupPress}
    />
  );
}

export default BackupsConnector;
