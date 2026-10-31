import React, { useCallback, useState } from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import QualityProfileModel from 'typings/QualityProfile';
import EditQualityProfileModalContentConnector from './EditQualityProfileModalContentConnector';

interface EditQualityProfileModalProps {
  id?: number;
  // The profile to start from when it is new, e.g. a clone
  defaultQualityProfile?: QualityProfileModel;
  isOpen: boolean;
  onModalClose: () => void;
  onDeleteQualityProfilePress?: () => void;
}

function EditQualityProfileModal({
  isOpen,
  onModalClose,
  ...otherProps
}: EditQualityProfileModalProps) {
  // The modal keeps the height of its tallest content, so that it does not
  // shrink when the groups are edited or the items dragged
  const [height, setHeight] = useState<number | 'auto'>('auto');

  const handleContentHeightChange = useCallback((newHeight: number) => {
    setHeight((current) =>
      current === 'auto' || newHeight > current ? newHeight : current
    );
  }, []);

  return (
    <Modal
      style={{ height: `${height}px` }}
      isOpen={isOpen}
      size={sizes.EXTRA_LARGE}
      onModalClose={onModalClose}
    >
      <EditQualityProfileModalContentConnector
        {...otherProps}
        onContentHeightChange={handleContentHeightChange}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

export default EditQualityProfileModal;
