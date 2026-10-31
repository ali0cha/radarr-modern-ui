import React from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import EditImportListExclusionModalContent from './EditImportListExclusionModalContent';

interface EditImportListExclusionModalProps {
  id?: number;
  isOpen: boolean;
  onModalClose: () => void;
  onDeleteImportListExclusionPress?: () => void;
}

function EditImportListExclusionModal({
  isOpen,
  onModalClose,
  ...otherProps
}: EditImportListExclusionModalProps) {
  return (
    <Modal size={sizes.MEDIUM} isOpen={isOpen} onModalClose={onModalClose}>
      <EditImportListExclusionModalContent
        {...otherProps}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default EditImportListExclusionModal;
