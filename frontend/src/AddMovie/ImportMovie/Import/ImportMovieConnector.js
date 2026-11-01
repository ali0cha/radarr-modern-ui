import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setAddDefaults, useAddDefaults } from 'AddMovie/useAddMovie';
import { useRootFolder } from 'RootFolder/useRootFolders';
import { useQualityProfiles } from 'Settings/Profiles/Quality/useQualityProfiles';
import {
  clearImportMovie,
  importMovies,
  setImportMovieValue,
  useImportMovieItems
} from '../useImportMovie';
import ImportMovie from './ImportMovie';

function ImportMovieConnector() {
  const { rootFolderId: rootFolderIdParam } = useParams();
  const rootFolderId = parseInt(rootFolderIdParam);

  const { data: rootFolder, isFetching, isSuccess, error } = useRootFolder(rootFolderId);
  const { items: qualityProfiles } = useQualityProfiles();
  const { qualityProfileId: defaultQualityProfileId } = useAddDefaults();
  const items = useImportMovieItems();

  useEffect(() => {
    if (
      qualityProfiles.length &&
      (!defaultQualityProfileId || !qualityProfiles.some((p) => p.id === defaultQualityProfileId))
    ) {
      setAddDefaults({ qualityProfileId: qualityProfiles[0].id });
    }
    // The default is only chosen when the page is shown
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qualityProfiles.length]);

  useEffect(() => clearImportMovie, []);

  const handleInputChange = useCallback((ids, name, value) => {
    setAddDefaults({ [name]: value });

    ids.forEach((id) => {
      setImportMovieValue({
        id,
        [name]: value
      });
    });
  }, []);

  const handleImportPress = useCallback((ids) => {
    importMovies({ ids });
  }, []);

  return (
    <ImportMovie
      {...rootFolder}
      rootFolderId={rootFolderId}
      rootFoldersFetching={isFetching}
      rootFoldersPopulated={isSuccess}
      rootFoldersError={error ?? undefined}
      qualityProfiles={qualityProfiles}
      defaultQualityProfileId={defaultQualityProfileId}
      items={items}
      onInputChange={handleInputChange}
      onImportPress={handleImportPress}
    />
  );
}

ImportMovieConnector.propTypes = {
  rootFolderId: PropTypes.number
};

export default ImportMovieConnector;
