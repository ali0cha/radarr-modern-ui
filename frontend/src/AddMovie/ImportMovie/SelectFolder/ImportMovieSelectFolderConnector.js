import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAddRootFolder, useDeleteRootFolder, useRootFolders } from 'RootFolder/useRootFolders';
import createSystemStatusSelector from 'Store/Selectors/createSystemStatusSelector';
import ImportMovieSelectFolder from './ImportMovieSelectFolder';

function ImportMovieSelectFolderConnector() {
  const navigate = useNavigate();
  const { isWindows } = useSelector(createSystemStatusSelector());
  const rootFolders = useRootFolders();
  const { mutate: addRootFolder, isPending: isSaving, error: saveError } = useAddRootFolder();
  const { mutate: deleteRootFolder } = useDeleteRootFolder();

  // A new root folder opens its import page
  const handleNewRootFolderSelect = useCallback((path) => {
    addRootFolder({ path }, {
      onSuccess: (rootFolder) => {
        navigate(`/add/import/${rootFolder.id}`);
      }
    });
  }, [addRootFolder, navigate]);

  const handleDeleteRootFolderPress = useCallback((id) => {
    deleteRootFolder({ id });
  }, [deleteRootFolder]);

  return (
    <ImportMovieSelectFolder
      {...rootFolders}
      isWindows={isWindows}
      isSaving={isSaving}
      saveError={saveError ?? undefined}
      error={rootFolders.error ?? undefined}
      onNewRootFolderSelect={handleNewRootFolderSelect}
      onDeleteRootFolderPress={handleDeleteRootFolderPress}
    />
  );
}

export default ImportMovieSelectFolderConnector;
