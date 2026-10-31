import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDeleteRootFolder } from 'RootFolder/useRootFolders';
import ImportMovieRootFolderRow from './ImportMovieRootFolderRow';

function ImportMovieRootFolderRowConnector(props) {
  const { id } = props;
  const { mutate: deleteRootFolder } = useDeleteRootFolder();

  const handleDeletePress = useCallback(() => {
    deleteRootFolder({ id });
  }, [id, deleteRootFolder]);

  return (
    <ImportMovieRootFolderRow
      {...props}
      onDeletePress={handleDeletePress}
    />
  );
}

ImportMovieRootFolderRowConnector.propTypes = {
  id: PropTypes.number.isRequired
};

export default ImportMovieRootFolderRowConnector;
