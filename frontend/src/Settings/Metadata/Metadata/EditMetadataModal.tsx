import React from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import EditMetadataModalContent, {
  EditMetadataModalContentProps,
} from './EditMetadataModalContent';

interface EditMetadataModalProps extends EditMetadataModalContentProps {
  isOpen: boolean;
}

function EditMetadataModal({
  isOpen,
  onModalClose,
  ...otherProps
}: EditMetadataModalProps) {
  return (
    <Modal size={sizes.MEDIUM} isOpen={isOpen} onModalClose={onModalClose}>
      <EditMetadataModalContent {...otherProps} onModalClose={onModalClose} />
    </Modal>
  );
}

export default EditMetadataModal;
