import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import { usePrefetchRootFolders } from 'RootFolder/useRootFolders';
import useTags from 'Tags/useTags';
import AutoTaggingModel from 'typings/AutoTagging';
import translate from 'Utilities/String/translate';
import AutoTagging from './AutoTagging';
import EditAutoTaggingModal from './EditAutoTaggingModal';
import {
  getClonedAutoTagging,
  NEW_AUTO_TAGGING,
  useAutoTaggings,
} from './useAutoTaggings';
import styles from './AutoTaggings.module.css';

export default function AutoTaggings() {
  const { error, items, isFetching, isPopulated } = useAutoTaggings();

  const tagList = useTags();

  usePrefetchRootFolders();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // The auto tag that is edited when it is new: empty or a clone
  const [newAutoTagging, setNewAutoTagging] =
    useState<AutoTaggingModel>(NEW_AUTO_TAGGING);

  const onClonePress = useCallback(
    (id: number) => {
      const autoTagging = items.find((item) => item.id === id);

      if (autoTagging) {
        setNewAutoTagging(getClonedAutoTagging(autoTagging));
        setIsEditModalOpen(true);
      }
    },
    [items]
  );

  const onEditPress = useCallback(() => {
    setNewAutoTagging(NEW_AUTO_TAGGING);
    setIsEditModalOpen(true);
  }, []);

  const onEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  return (
    <FieldSet legend={translate('AutoTagging')}>
      <PageSectionContent
        errorMessage={translate('AutoTaggingLoadError')}
        error={error ?? undefined}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.autoTaggings}>
          {items.map((item) => {
            return (
              <AutoTagging
                key={item.id}
                {...item}
                tagList={tagList}
                onCloneAutoTaggingPress={onClonePress}
              />
            );
          })}

          <Card className={styles.addAutoTagging} onPress={onEditPress}>
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>
        </div>

        <EditAutoTaggingModal
          isOpen={isEditModalOpen}
          defaultAutoTagging={newAutoTagging}
          onModalClose={onEditModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}
