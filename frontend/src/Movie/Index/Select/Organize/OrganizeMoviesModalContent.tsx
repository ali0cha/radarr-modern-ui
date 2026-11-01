import { orderBy } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { RENAME_MOVIE } from 'Commands/commandNames';
import { executeCommand } from 'Commands/useCommands';
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { icons, kinds } from 'Helpers/Props';
import Movie from 'Movie/Movie';
import { useMovies } from 'Movie/useMovies';
import translate from 'Utilities/String/translate';
import styles from './OrganizeMoviesModalContent.module.css';

interface OrganizeMoviesModalContentProps {
  movieIds: number[];
  onModalClose: () => void;
}

function OrganizeMoviesModalContent(props: OrganizeMoviesModalContentProps) {
  const { movieIds, onModalClose } = props;

  const { movies: allMovies } = useMovies();

  const movieTitles = useMemo(() => {
    const movie = movieIds.reduce((acc: Movie[], id) => {
      const s = allMovies.find((s) => s.id === id);

      if (s) {
        acc.push(s);
      }

      return acc;
    }, []);

    const sorted = orderBy(movie, ['sortTitle']);

    return sorted.map((s) => s.title);
  }, [movieIds, allMovies]);

  const onOrganizePress = useCallback(() => {
    executeCommand({
      name: RENAME_MOVIE,
      movieIds,
    });

    onModalClose();
  }, [movieIds, onModalClose]);

  return (
    <ModalContent onModalClose={onModalClose}>
      <ModalHeader>{translate('OrganizeSelectedMovies')}</ModalHeader>

      <ModalBody>
        <Alert>
          {translate('PreviewRenameHelpText')}
          <Icon className={styles.renameIcon} name={icons.ORGANIZE} />
        </Alert>

        <div className={styles.message}>
          {translate('OrganizeConfirm', { count: movieTitles.length })}
        </div>

        <ul>
          {movieTitles.map((title) => {
            return <li key={title}>{title}</li>;
          })}
        </ul>
      </ModalBody>

      <ModalFooter>
        <Button onPress={onModalClose}>{translate('Cancel')}</Button>

        <Button kind={kinds.DANGER} onPress={onOrganizePress}>
          {translate('Organize')}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default OrganizeMoviesModalContent;
