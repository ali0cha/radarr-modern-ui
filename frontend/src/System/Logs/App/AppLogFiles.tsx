import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import * as commandNames from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import { fetchLogFiles } from 'Store/Actions/systemActions';
import LogFiles from '../LogFiles';

function AppLogFiles() {
  const dispatch = useDispatch();
  const { isFetching, items } = useSelector(
    (state: AppState) => state.system.logFiles
  );

  const isDeleteFilesExecuting = useCommandExecuting(
    commandNames.DELETE_LOG_FILES
  );

  const handleRefreshPress = useCallback(() => {
    dispatch(fetchLogFiles());
  }, [dispatch]);

  const handleDeleteFilesPress = useCallback(() => {
    executeCommand({
      name: commandNames.DELETE_LOG_FILES,
      commandFinished: () => {
        dispatch(fetchLogFiles());
      },
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLogFiles());
  }, [dispatch]);

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
