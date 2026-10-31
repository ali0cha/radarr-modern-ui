import React from 'react';
import Modal from 'Components/Modal/Modal';
import { AutoTaggingSpecification } from 'typings/AutoTagging';
import AddSpecificationModalContent from './AddSpecificationModalContent';

interface AddSpecificationModalProps {
  isOpen: boolean;
  onSpecificationSelect: (specification: AutoTaggingSpecification) => void;
  onModalClose: () => void;
}

function AddSpecificationModal({
  isOpen,
  onSpecificationSelect,
  onModalClose,
}: AddSpecificationModalProps) {
  return (
    <Modal isOpen={isOpen} onModalClose={onModalClose}>
      <AddSpecificationModalContent
        onSpecificationSelect={onSpecificationSelect}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default AddSpecificationModal;
