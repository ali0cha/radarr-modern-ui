import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import Tooltip from 'Components/Tooltip/Tooltip';
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import { useDeleteProvider } from 'Settings/useProviderSettings';
import QualityProfileModel from 'typings/QualityProfile';
import translate from 'Utilities/String/translate';
import EditQualityProfileModal from './EditQualityProfileModal';
import { QUALITY_PROFILES_PATH } from './useQualityProfiles';
import styles from './QualityProfile.module.css';

interface QualityProfileProps extends QualityProfileModel {
  onCloneQualityProfilePress: (id: number) => void;
}

function QualityProfile({
  id,
  name,
  upgradeAllowed,
  cutoff,
  items,
  onCloneQualityProfilePress,
}: QualityProfileProps) {
  const { deleteProvider, isDeleting } = useDeleteProvider<QualityProfileModel>(
    id,
    QUALITY_PROFILES_PATH
  );

  const [isEditQualityProfileModalOpen, setIsEditQualityProfileModalOpen] =
    useState(false);
  const [isDeleteQualityProfileModalOpen, setIsDeleteQualityProfileModalOpen] =
    useState(false);

  const handleEditQualityProfilePress = useCallback(() => {
    setIsEditQualityProfileModalOpen(true);
  }, []);

  const handleEditQualityProfileModalClose = useCallback(() => {
    setIsEditQualityProfileModalOpen(false);
  }, []);

  const handleDeleteQualityProfilePress = useCallback(() => {
    setIsEditQualityProfileModalOpen(false);
    setIsDeleteQualityProfileModalOpen(true);
  }, []);

  const handleDeleteQualityProfileModalClose = useCallback(() => {
    setIsDeleteQualityProfileModalOpen(false);
  }, []);

  const handleConfirmDeleteQualityProfile = useCallback(() => {
    deleteProvider();
  }, [deleteProvider]);

  const handleCloneQualityProfilePress = useCallback(() => {
    onCloneQualityProfilePress(id);
  }, [id, onCloneQualityProfilePress]);

  return (
    <Card
      className={styles.qualityProfile}
      overlayContent={true}
      onPress={handleEditQualityProfilePress}
    >
      <div className={styles.nameContainer}>
        <div className={styles.name}>{name}</div>

        <IconButton
          className={styles.cloneButton}
          title={translate('CloneProfile')}
          name={icons.CLONE}
          onPress={handleCloneQualityProfilePress}
        />
      </div>

      <div className={styles.qualities}>
        {items.map((item) => {
          if (!item.allowed) {
            return null;
          }

          if (item.quality) {
            const isCutoff = upgradeAllowed && item.quality.id === cutoff;

            return (
              <Label
                key={item.quality.id}
                kind={isCutoff ? kinds.INFO : kinds.DEFAULT}
                title={
                  isCutoff
                    ? translate('UpgradeUntilThisQualityIsMetOrExceeded')
                    : undefined
                }
              >
                {item.quality.name}
              </Label>
            );
          }

          const isCutoff = upgradeAllowed && item.id === cutoff;

          return (
            <Tooltip
              key={item.id}
              className={styles.tooltipLabel}
              anchor={
                <Label
                  kind={isCutoff ? kinds.INFO : kinds.DEFAULT}
                  title={isCutoff ? translate('Cutoff') : undefined}
                >
                  {item.name}
                </Label>
              }
              tooltip={
                <div>
                  {item.items.map((groupItem) => {
                    return (
                      <Label
                        key={groupItem.quality?.id}
                        kind={isCutoff ? kinds.INFO : kinds.DEFAULT}
                        title={isCutoff ? translate('Cutoff') : undefined}
                      >
                        {groupItem.quality?.name}
                      </Label>
                    );
                  })}
                </div>
              }
              kind={kinds.INVERSE}
              position={tooltipPositions.TOP}
            />
          );
        })}
      </div>

      <EditQualityProfileModal
        id={id}
        isOpen={isEditQualityProfileModalOpen}
        onModalClose={handleEditQualityProfileModalClose}
        onDeleteQualityProfilePress={handleDeleteQualityProfilePress}
      />

      <ConfirmModal
        isOpen={isDeleteQualityProfileModalOpen}
        kind={kinds.DANGER}
        title={translate('DeleteQualityProfile')}
        message={translate('DeleteQualityProfileMessageText', { name })}
        confirmLabel={translate('Delete')}
        isSpinning={isDeleting}
        onConfirm={handleConfirmDeleteQualityProfile}
        onCancel={handleDeleteQualityProfileModalClose}
      />
    </Card>
  );
}

export default QualityProfile;
