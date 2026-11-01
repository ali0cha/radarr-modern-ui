import React from 'react';
import Modal from 'Components/Modal/Modal';
import AddNewMovieCollectionMovieModalContent, {
  AddNewMovieCollectionMovieModalContentProps,
} from './AddNewMovieCollectionMovieModalContent';

interface AddNewCollectionMovieModalProps
  extends AddNewMovieCollectionMovieModalContentProps {
  isOpen: boolean;
}

function AddNewMovieCollectionMovieModal({
  isOpen,
  onModalClose,
  ...otherProps
}: AddNewCollectionMovieModalProps) {
  return (
    <Modal isOpen={isOpen} onModalClose={onModalClose}>
      <AddNewMovieCollectionMovieModalContent
        {...otherProps}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default AddNewMovieCollectionMovieModal;
