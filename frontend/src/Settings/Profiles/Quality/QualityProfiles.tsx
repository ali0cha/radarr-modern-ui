import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import { fetchMovieCollections } from 'Store/Actions/movieCollectionActions';
import QualityProfileModel from 'typings/QualityProfile';
import translate from 'Utilities/String/translate';
import EditQualityProfileModal from './EditQualityProfileModal';
import QualityProfile from './QualityProfile';
import { useQualityProfiles } from './useQualityProfiles';
import styles from './QualityProfiles.module.css';

function getClonedQualityProfile(qualityProfile: QualityProfileModel) {
  const { id: _id, ...cloned } = qualityProfile;

  return {
    ...cloned,
    name: translate('DefaultNameCopiedProfile', { name: qualityProfile.name }),
  } as QualityProfileModel;
}

function QualityProfiles() {
  const dispatch = useDispatch();
  const { items, isFetching, isPopulated, error } = useQualityProfiles();

  const [isQualityProfileModalOpen, setIsQualityProfileModalOpen] =
    useState(false);

  // The profile that is edited when it is new: empty or a clone
  const [newQualityProfile, setNewQualityProfile] = useState<
    QualityProfileModel | undefined
  >();

  const handleCloneQualityProfilePress = useCallback(
    (id: number) => {
      const qualityProfile = items.find((item) => item.id === id);

      if (qualityProfile) {
        setNewQualityProfile(getClonedQualityProfile(qualityProfile));
        setIsQualityProfileModalOpen(true);
      }
    },
    [items]
  );

  const handleEditQualityProfilePress = useCallback(() => {
    setNewQualityProfile(undefined);
    setIsQualityProfileModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsQualityProfileModalOpen(false);
  }, []);

  // The collections tell whether a profile is in use
  useEffect(() => {
    dispatch(fetchMovieCollections());
  }, [dispatch]);

  return (
    <FieldSet legend={translate('QualityProfiles')}>
      <PageSectionContent
        errorMessage={translate('QualityProfilesLoadError')}
        error={error ?? undefined}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.qualityProfiles}>
          {items.map((item) => {
            return (
              <QualityProfile
                key={item.id}
                {...item}
                onCloneQualityProfilePress={handleCloneQualityProfilePress}
              />
            );
          })}

          <Card
            className={styles.addQualityProfile}
            onPress={handleEditQualityProfilePress}
          >
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>
        </div>

        <EditQualityProfileModal
          isOpen={isQualityProfileModalOpen}
          defaultQualityProfile={newQualityProfile}
          onModalClose={handleModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default QualityProfiles;
