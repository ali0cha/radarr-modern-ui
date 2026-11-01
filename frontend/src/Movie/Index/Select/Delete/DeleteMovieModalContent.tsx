import { orderBy } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { inputTypes, kinds } from 'Helpers/Props';
import Movie from 'Movie/Movie';
import { setDeleteOptions, useDeleteOptions, useMovies } from 'Movie/useMovies';
import { InputChanged } from 'typings/inputs';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './DeleteMovieModalContent.module.css';

export interface DeleteMovieModalContentProps {
  movieIds: number[];
  onDeleteMoviesPress: (payload: {
    movieIds: number[];
    deleteFiles: boolean;
    addImportExclusion: boolean;
  }) => void;
  onModalClose(): void;
}

function DeleteMovieModalContent(props: DeleteMovieModalContentProps) {
  const { movieIds, onDeleteMoviesPress, onModalClose } = props;

  const { addImportExclusion } = useDeleteOptions();
  const { movies: allMovies } = useMovies();

  const [deleteFiles, setDeleteFiles] = useState(false);

  const movies = useMemo((): Movie[] => {
    const movies = movieIds.map((id) => {
      return allMovies.find((s) => s.id === id);
    }) as Movie[];

    return orderBy(movies, ['sortTitle']);
  }, [movieIds, allMovies]);

  const onDeleteFilesChange = useCallback(
    ({ value }: InputChanged<boolean>) => {
      setDeleteFiles(value);
    },
    [setDeleteFiles]
  );

  const onDeleteOptionChange = useCallback(
    ({ value }: { name: string; value: boolean }) => {
      setDeleteOptions({ addImportExclusion: value });
    },
    []
  );

  const onDeleteMoviesConfirmed = useCallback(() => {
    setDeleteFiles(false);

    onDeleteMoviesPress({
      movieIds,
      deleteFiles,
      addImportExclusion,
    });

    onModalClose();
  }, [
    movieIds,
    deleteFiles,
    addImportExclusion,
    setDeleteFiles,
    onDeleteMoviesPress,
    onModalClose,
  ]);

  const { totalMovieFileCount, totalSizeOnDisk } = useMemo(() => {
    return movies.reduce(
      (acc, { statistics = {} }) => {
        const { movieFileCount = 0, sizeOnDisk = 0 } = statistics;

        acc.totalMovieFileCount += movieFileCount;
        acc.totalSizeOnDisk += sizeOnDisk;

        return acc;
      },
      {
        totalMovieFileCount: 0,
        totalSizeOnDisk: 0,
      }
    );
  }, [movies]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>
        {movies.length > 1
          ? translate('DeleteSelectedMovies')
          : translate('DeleteSelectedMovie')}
      </ModalHeader>

      <ModalBody>
        <div>
          <FormGroup>
            <FormLabel>{translate('AddListExclusion')}</FormLabel>

            <FormInputGroup
              type={inputTypes.CHECK}
              name="addImportExclusion"
              value={addImportExclusion}
              helpText={translate('AddListExclusionMovieHelpText')}
              onChange={onDeleteOptionChange}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>
              {movies.length > 1
                ? translate('DeleteMovieFolders')
                : translate('DeleteMovieFolder')}
            </FormLabel>

            <FormInputGroup
              type={inputTypes.CHECK}
              name="deleteFiles"
              value={deleteFiles}
              helpText={
                movies.length > 1
                  ? translate('DeleteMovieFoldersHelpText')
                  : translate('DeleteMovieFolderHelpText')
              }
              kind="danger"
              onChange={onDeleteFilesChange}
            />
          </FormGroup>
        </div>

        <div className={styles.message}>
          {deleteFiles
            ? translate('DeleteMovieFolderCountWithFilesConfirmation', {
                count: movies.length,
              })
            : translate('DeleteMovieFolderCountConfirmation', {
                count: movies.length,
              })}
        </div>

        <ul>
          {movies.map(({ title, path, statistics = {} }) => {
            const { movieFileCount = 0, sizeOnDisk = 0 } = statistics;

            return (
              <li key={title}>
                <span>{title}</span>

                {deleteFiles && (
                  <span>
                    <span className={styles.pathContainer}>
                      -<span className={styles.path}>{path}</span>
                    </span>

                    {!!movieFileCount && (
                      <span className={styles.statistics}>
                        (
                        {translate('DeleteMovieFolderMovieCount', {
                          movieFileCount,
                          size: formatBytes(sizeOnDisk),
                        })}
                        )
                      </span>
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {deleteFiles && !!totalMovieFileCount ? (
          <div className={styles.deleteFilesMessage}>
            {translate('DeleteMovieFolderMovieCount', {
              movieFileCount: totalMovieFileCount,
              size: formatBytes(totalSizeOnDisk),
            })}
          </div>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <Button kind={kinds.DANGER} onPress={onDeleteMoviesConfirmed}>
          {translate('Delete')}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default DeleteMovieModalContent;
