import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSelect } from 'App/SelectContext';
import { RENAME_MOVIE } from 'Commands/commandNames';
import SpinnerButton from 'Components/Link/SpinnerButton';
import PageContentFooter from 'Components/Page/PageContentFooter';
import { kinds } from 'Helpers/Props';
import { useBulkDeleteMovies, useMovieEditor } from 'Movie/useMovies';
import { usePrefetchRootFolders } from 'RootFolder/useRootFolders';
import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import DeleteMovieModal from './Delete/DeleteMovieModal';
import EditMoviesModal from './Edit/EditMoviesModal';
import OrganizeMoviesModal from './Organize/OrganizeMoviesModal';
import TagsModal from './Tags/TagsModal';
import styles from './MovieIndexSelectFooter.module.css';

interface SavePayload {
  monitored?: boolean;
  qualityProfileId?: number;
  rootFolderPath?: string;
  moveFiles?: boolean;
}

function MovieIndexSelectFooter() {
  const isOrganizingMovies = useSelector(
    createCommandExecutingSelector(RENAME_MOVIE)
  );

  usePrefetchRootFolders();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { saveEditor: saveMovies, isSavingEditor: isSavingMovies } =
    useMovieEditor();
  const { saveEditor: saveTags, isSavingEditor: isSavingTags } =
    useMovieEditor();

  const [selectState, selectDispatch] = useSelect();
  const { selectedState } = selectState;

  const movieIds = useMemo(() => {
    return getSelectedIds(selectedState);
  }, [selectedState]);

  const { bulkDelete, isDeleting } = useBulkDeleteMovies(() => {
    selectDispatch({ type: 'unselectAll' });
  });

  const selectedCount = movieIds.length ? movieIds.length : 0;

  const onEditPress = useCallback(() => {
    setIsEditModalOpen(true);
  }, [setIsEditModalOpen]);

  const onEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, [setIsEditModalOpen]);

  const onSavePress = useCallback(
    (payload: SavePayload) => {
      setIsEditModalOpen(false);

      saveMovies({
        ...payload,
        movieIds,
      });
    },
    [movieIds, saveMovies]
  );

  const onOrganizePress = useCallback(() => {
    setIsOrganizeModalOpen(true);
  }, [setIsOrganizeModalOpen]);

  const onOrganizeModalClose = useCallback(() => {
    setIsOrganizeModalOpen(false);
  }, [setIsOrganizeModalOpen]);

  const onTagsPress = useCallback(() => {
    setIsTagsModalOpen(true);
  }, [setIsTagsModalOpen]);

  const onTagsModalClose = useCallback(() => {
    setIsTagsModalOpen(false);
  }, [setIsTagsModalOpen]);

  const onApplyTagsPress = useCallback(
    (tags: number[], applyTags: string) => {
      setIsTagsModalOpen(false);

      saveTags({
        movieIds,
        tags,
        applyTags,
      });
    },
    [movieIds, saveTags]
  );

  const onDeletePress = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, [setIsDeleteModalOpen]);

  const onDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const anySelected = selectedCount > 0;

  return (
    <PageContentFooter className={styles.footer}>
      <div className={styles.buttons}>
        <div className={styles.actionButtons}>
          <SpinnerButton
            isSpinning={isSavingMovies}
            isDisabled={!anySelected || isOrganizingMovies}
            onPress={onEditPress}
          >
            {translate('Edit')}
          </SpinnerButton>

          <SpinnerButton
            kind={kinds.WARNING}
            isSpinning={isOrganizingMovies}
            isDisabled={!anySelected || isOrganizingMovies}
            onPress={onOrganizePress}
          >
            {translate('RenameFiles')}
          </SpinnerButton>

          <SpinnerButton
            isSpinning={isSavingTags}
            isDisabled={!anySelected || isOrganizingMovies}
            onPress={onTagsPress}
          >
            {translate('SetTags')}
          </SpinnerButton>
        </div>

        <div className={styles.deleteButtons}>
          <SpinnerButton
            kind={kinds.DANGER}
            isSpinning={isDeleting}
            isDisabled={!anySelected || isDeleting}
            onPress={onDeletePress}
          >
            {translate('Delete')}
          </SpinnerButton>
        </div>
      </div>

      <div className={styles.selected}>
        {translate('MoviesSelectedInterp', { count: selectedCount })}
      </div>

      <EditMoviesModal
        isOpen={isEditModalOpen}
        movieIds={movieIds}
        onSavePress={onSavePress}
        onModalClose={onEditModalClose}
      />

      <TagsModal
        isOpen={isTagsModalOpen}
        movieIds={movieIds}
        onApplyTagsPress={onApplyTagsPress}
        onModalClose={onTagsModalClose}
      />

      <OrganizeMoviesModal
        isOpen={isOrganizeModalOpen}
        movieIds={movieIds}
        onModalClose={onOrganizeModalClose}
      />

      <DeleteMovieModal
        isOpen={isDeleteModalOpen}
        movieIds={movieIds}
        onDeleteMoviesPress={bulkDelete}
        onModalClose={onDeleteModalClose}
      />
    </PageContentFooter>
  );
}

export default MovieIndexSelectFooter;
