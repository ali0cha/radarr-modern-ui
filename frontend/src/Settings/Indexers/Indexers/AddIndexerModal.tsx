import React from 'react';
import Modal from 'Components/Modal/Modal';
import Indexer from 'typings/Indexer';
import AddIndexerModalContent from './AddIndexerModalContent';

interface AddIndexerModalProps {
  isOpen: boolean;
  onIndexerSelect: (indexer: Indexer) => void;
  onModalClose: () => void;
}

function AddIndexerModal({
  isOpen,
  onIndexerSelect,
  onModalClose,
}: AddIndexerModalProps) {
  return (
    <Modal isOpen={isOpen} onModalClose={onModalClose}>
      <AddIndexerModalContent
        onIndexerSelect={onIndexerSelect}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default AddIndexerModal;
