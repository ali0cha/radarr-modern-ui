import React from 'react';
import Modal from 'Components/Modal/Modal';
import EditMovieCollectionModalContent, {
  EditMovieCollectionModalContentProps,
} from './EditMovieCollectionModalContent';

interface EditMovieCollectionModalProps
  extends EditMovieCollectionModalContentProps {
  isOpen: boolean;
}

function EditMovieCollectionModal({
  isOpen,
  onModalClose,
  ...otherProps
}: EditMovieCollectionModalProps) {
  return (
    <Modal isOpen={isOpen} onModalClose={onModalClose}>
      <EditMovieCollectionModalContent
        {...otherProps}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default EditMovieCollectionModal;
