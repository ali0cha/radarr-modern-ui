import React from 'react';
import Modal from 'Components/Modal/Modal';
import DeleteMovieModalContent, {
  DeleteMovieModalContentProps,
} from './DeleteMovieModalContent';

interface DeleteMovieModalProps {
  isOpen: boolean;
  movieIds: number[];
  onDeleteMoviesPress: DeleteMovieModalContentProps['onDeleteMoviesPress'];
  onModalClose(): void;
}

function DeleteMovieModal(props: DeleteMovieModalProps) {
  const { isOpen, movieIds, onDeleteMoviesPress, onModalClose } = props;

  return (
    <Modal isOpen={isOpen} onModalClose={onModalClose}>
      <DeleteMovieModalContent
        movieIds={movieIds}
        onDeleteMoviesPress={onDeleteMoviesPress}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default DeleteMovieModal;
