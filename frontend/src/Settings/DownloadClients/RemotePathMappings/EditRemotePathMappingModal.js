import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import { useDownloadClientHosts } from '../useDownloadClients';
import EditRemotePathMappingModalContentConnector from './EditRemotePathMappingModalContentConnector';

function EditRemotePathMappingModal({ isOpen, onModalClose, ...otherProps }) {
  const downloadClientHosts = useDownloadClientHosts();

  return (
    <Modal
      size={sizes.MEDIUM}
      isOpen={isOpen}
      onModalClose={onModalClose}
    >
      <EditRemotePathMappingModalContentConnector
        {...otherProps}
        downloadClientHosts={downloadClientHosts}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

EditRemotePathMappingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default EditRemotePathMappingModal;
