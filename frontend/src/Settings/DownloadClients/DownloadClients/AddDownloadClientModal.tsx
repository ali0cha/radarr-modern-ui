import React from 'react';
import Modal from 'Components/Modal/Modal';
import DownloadClient from 'typings/DownloadClient';
import AddDownloadClientModalContent from './AddDownloadClientModalContent';

interface AddDownloadClientModalProps {
  isOpen: boolean;
  onDownloadClientSelect: (downloadClient: DownloadClient) => void;
  onModalClose: () => void;
}

function AddDownloadClientModal({
  isOpen,
  onDownloadClientSelect,
  onModalClose,
}: AddDownloadClientModalProps) {
  return (
    <Modal isOpen={isOpen} onModalClose={onModalClose}>
      <AddDownloadClientModalContent
        onDownloadClientSelect={onDownloadClientSelect}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default AddDownloadClientModal;
