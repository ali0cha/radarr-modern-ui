import React, { useCallback } from 'react';
import * as commandNames from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import { useLogFiles } from 'System/useSystem';
import LogFiles from '../LogFiles';

function AppLogFiles() {
  const { isFetching, items, refetch } = useLogFiles();

  const isDeleteFilesExecuting = useCommandExecuting(
    commandNames.DELETE_LOG_FILES
  );

  const handleRefreshPress = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDeleteFilesPress = useCallback(() => {
    executeCommand({
      name: commandNames.DELETE_LOG_FILES,
      commandFinished: () => {
        refetch();
      },
    });
  }, [refetch]);

  return (
    <LogFiles
      isDeleteFilesExecuting={isDeleteFilesExecuting}
      isFetching={isFetching}
      items={items}
      type="app"
      onRefreshPress={handleRefreshPress}
      onDeleteFilesPress={handleDeleteFilesPress}
    />
  );
}

export default AppLogFiles;
