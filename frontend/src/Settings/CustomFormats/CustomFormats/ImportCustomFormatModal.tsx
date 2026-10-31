import React from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import ImportCustomFormatModalContent, {
  ImportCustomFormatModalContentProps,
} from './ImportCustomFormatModalContent';

interface ImportCustomFormatModalProps
  extends ImportCustomFormatModalContentProps {
  isOpen: boolean;
}

function ImportCustomFormatModal({
  isOpen,
  onModalClose,
  ...otherProps
}: ImportCustomFormatModalProps) {
  return (
    <Modal isOpen={isOpen} size={sizes.LARGE} onModalClose={onModalClose}>
      <ImportCustomFormatModalContent
        {...otherProps}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default ImportCustomFormatModal;
