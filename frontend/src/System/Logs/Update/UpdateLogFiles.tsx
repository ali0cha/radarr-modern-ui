import React, { useCallback } from 'react';
import * as commandNames from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import { useUpdateLogFiles } from 'System/useSystem';
import LogFiles from '../LogFiles';

function UpdateLogFiles() {
  const { isFetching, items, refetch } = useUpdateLogFiles();

  const isDeleteFilesExecuting = useCommandExecuting(
    commandNames.DELETE_UPDATE_LOG_FILES
  );

  const handleRefreshPress = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDeleteFilesPress = useCallback(() => {
    executeCommand({
      name: commandNames.DELETE_UPDATE_LOG_FILES,
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
      type="update"
      onRefreshPress={handleRefreshPress}
      onDeleteFilesPress={handleDeleteFilesPress}
    />
  );
}

export default UpdateLogFiles;
