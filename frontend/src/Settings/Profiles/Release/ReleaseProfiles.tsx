import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReleaseProfilesAppState } from 'App/State/SettingsAppState';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';
import { icons } from 'Helpers/Props';
import { useIndexers } from 'Settings/Indexers/useIndexers';
import { fetchReleaseProfiles } from 'Store/Actions/Settings/releaseProfiles';
import createClientSideCollectionSelector from 'Store/Selectors/createClientSideCollectionSelector';
import useTags from 'Tags/useTags';
import translate from 'Utilities/String/translate';
import EditReleaseProfileModal from './EditReleaseProfileModal';
import ReleaseProfileItem from './ReleaseProfileItem';
import styles from './ReleaseProfiles.module.css';

function ReleaseProfiles() {
  const { items, isFetching, isPopulated, error }: ReleaseProfilesAppState =
    useSelector(createClientSideCollectionSelector('settings.releaseProfiles'));

  const tagList = useTags();
  const { items: indexerList } = useIndexers();

  const dispatch = useDispatch();

  const [
    isAddReleaseProfileModalOpen,
    setAddReleaseProfileModalOpen,
    setAddReleaseProfileModalClosed,
  ] = useModalOpenState(false);

  useEffect(() => {
    dispatch(fetchReleaseProfiles());
  }, [dispatch]);

  return (
    <FieldSet legend={translate('ReleaseProfiles')}>
      <PageSectionContent
        errorMessage={translate('ReleaseProfilesLoadError')}
        isFetching={isFetching}
        isPopulated={isPopulated}
        error={error}
      >
        <div className={styles.releaseProfiles}>
          <Card
            className={styles.addReleaseProfile}
            onPress={setAddReleaseProfileModalOpen}
          >
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>

          {items.map((item) => {
            return (
              <ReleaseProfileItem
                key={item.id}
                tagList={tagList}
                indexerList={indexerList}
                {...item}
              />
            );
          })}
        </div>

        <EditReleaseProfileModal
          isOpen={isAddReleaseProfileModalOpen}
          onModalClose={setAddReleaseProfileModalClosed}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default ReleaseProfiles;
