import React from 'react';
import Modal from 'Components/Modal/Modal';
import Notification from 'typings/Notification';
import AddNotificationModalContent from './AddNotificationModalContent';

interface AddNotificationModalProps {
  isOpen: boolean;
  onNotificationSelect: (notification: Notification) => void;
  onModalClose: () => void;
}

function AddNotificationModal({
  isOpen,
  onNotificationSelect,
  onModalClose,
}: AddNotificationModalProps) {
  return (
    <Modal isOpen={isOpen} onModalClose={onModalClose}>
      <AddNotificationModalContent
        onNotificationSelect={onNotificationSelect}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default AddNotificationModal;
