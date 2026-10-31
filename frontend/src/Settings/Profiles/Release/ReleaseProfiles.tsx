import React from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import useModalOpenState from 'Helpers/Hooks/useModalOpenState';
import { icons } from 'Helpers/Props';
import { useIndexers } from 'Settings/Indexers/useIndexers';
import useTags from 'Tags/useTags';
import translate from 'Utilities/String/translate';
import EditReleaseProfileModal from './EditReleaseProfileModal';
import ReleaseProfileItem from './ReleaseProfileItem';
import { useReleaseProfiles } from './useReleaseProfiles';
import styles from './ReleaseProfiles.module.css';

function ReleaseProfiles() {
  const { items, isFetching, isPopulated, error } = useReleaseProfiles();

  const tagList = useTags();
  const { items: indexerList } = useIndexers();

  const [
    isAddReleaseProfileModalOpen,
    setAddReleaseProfileModalOpen,
    setAddReleaseProfileModalClosed,
  ] = useModalOpenState(false);

  return (
    <FieldSet legend={translate('ReleaseProfiles')}>
      <PageSectionContent
        errorMessage={translate('ReleaseProfilesLoadError')}
        isFetching={isFetching}
        isPopulated={isPopulated}
        error={error ?? undefined}
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
