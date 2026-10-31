import React from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import ExportCustomFormatModalContent from './ExportCustomFormatModalContent';

interface ExportCustomFormatModalProps {
  id: number;
  isOpen: boolean;
  onModalClose: () => void;
}

function ExportCustomFormatModal({
  id,
  isOpen,
  onModalClose,
}: ExportCustomFormatModalProps) {
  return (
    <Modal isOpen={isOpen} size={sizes.LARGE} onModalClose={onModalClose}>
      <ExportCustomFormatModalContent id={id} onModalClose={onModalClose} />
    </Modal>
  );
}

export default ExportCustomFormatModal;
