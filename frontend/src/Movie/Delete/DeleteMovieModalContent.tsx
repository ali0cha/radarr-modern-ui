import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import {
  setMovieCollection,
  useCollectionByTmdbId,
} from 'Collection/useMovieCollections';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { icons, inputTypes, kinds } from 'Helpers/Props';
import { Statistics } from 'Movie/Movie';
import {
  setDeleteOptions,
  useDeleteMovie,
  useDeleteOptions,
  useMovie,
} from 'Movie/useMovies';
import { CheckInputChanged } from 'typings/inputs';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './DeleteMovieModalContent.module.css';

export interface DeleteMovieModalContentProps {
  movieId: number;
  onModalClose: () => void;
}

function DeleteMovieModalContent({
  movieId,
  onModalClose,
}: DeleteMovieModalContentProps) {
  const {
    title,
    path,
    collection,
    statistics = {} as Statistics,
  } = useMovie(movieId)!;
  const { addImportExclusion } = useDeleteOptions();
  const collectionOfMovie = useCollectionByTmdbId(collection?.tmdbId ?? 0);
  const queryClient = useQueryClient();

  const { movieFileCount = 0, sizeOnDisk = 0 } = statistics;

  const [deleteFiles, setDeleteFiles] = useState(false);

  const handleDeleteFilesChange = useCallback(
    ({ value }: CheckInputChanged) => {
      setDeleteFiles(value);
    },
    []
  );

  // The collection the movie belongs to has one movie more missing, unless the
  // movie is the last one that it has.
  const updateCollection = useCallback(() => {
    if (
      !collectionOfMovie ||
      collectionOfMovie.movies.length - collectionOfMovie.missingMovies === 1
    ) {
      return;
    }

    setMovieCollection(queryClient, {
      id: collectionOfMovie.id,
      missingMovies: collectionOfMovie.missingMovies + 1,
    });
  }, [collectionOfMovie, queryClient]);

  const { deleteMovie } = useDeleteMovie(movieId, updateCollection);

  const handleDeleteMovieConfirmed = useCallback(() => {
    deleteMovie({ deleteFiles, addImportExclusion });

    onModalClose();
  }, [addImportExclusion, deleteFiles, deleteMovie, onModalClose]);

  const handleDeleteOptionChange = useCallback(
    ({ value }: CheckInputChanged) => {
      setDeleteOptions({ addImportExclusion: value });
    },
    []
  );

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('DeleteHeader', { title })}</ModalHeader>

      <ModalBody>
        <div className={styles.pathContainer}>
          <Icon className={styles.pathIcon} name={icons.FOLDER} />

          {path}
        </div>

        <FormGroup>
          <FormLabel>{translate('AddListExclusion')}</FormLabel>

          <FormInputGroup
            type={inputTypes.CHECK}
            name="addImportExclusion"
            value={addImportExclusion}
            helpText={translate('AddListExclusionMovieHelpText')}
            kind={kinds.DANGER}
            onChange={handleDeleteOptionChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>
            {movieFileCount === 0
              ? translate('DeleteMovieFolder')
              : translate('DeleteMovieFiles', { movieFileCount })}
          </FormLabel>

          <FormInputGroup
            type={inputTypes.CHECK}
            name="deleteFiles"
            value={deleteFiles}
            helpText={
              movieFileCount === 0
                ? translate('DeleteMovieFolderHelpText')
                : translate('DeleteMovieFilesHelpText')
            }
            kind={kinds.DANGER}
            onChange={handleDeleteFilesChange}
          />
        </FormGroup>

        {deleteFiles ? (
          <div className={styles.deleteFilesMessage}>
            <div>
              <InlineMarkdown
                data={translate('DeleteMovieFolderConfirmation', { path })}
                blockClassName={styles.folderPath}
              />
            </div>

            {movieFileCount ? (
              <div className={styles.deleteCount}>
                {translate('DeleteMovieFolderMovieCount', {
                  movieFileCount,
                  size: formatBytes(sizeOnDisk),
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Close')}</Button>

        <Button kind={kinds.DANGER} onPress={handleDeleteMovieConfirmed}>
          {translate('Delete')}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default DeleteMovieModalContent;
