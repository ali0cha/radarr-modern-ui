import React, { useCallback, useState } from 'react';
import Card from 'Components/Card';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';
import { icons } from 'Helpers/Props';
import Indexer from 'typings/Indexer';
import translate from 'Utilities/String/translate';
import { getClonedIndexer, useIndexers } from '../useIndexers';
import AddIndexerModal from './AddIndexerModal';
import EditIndexerModal from './EditIndexerModal';
import IndexerComponent from './Indexer';
import styles from './Indexers.module.css';

function Indexers() {
  const { items, isFetching, isPopulated, error } = useIndexers();

  const [isAddIndexerModalOpen, setIsAddIndexerModalOpen] = useState(false);
  const [isEditIndexerModalOpen, setIsEditIndexerModalOpen] = useState(false);

  // The indexer that is edited when it is new: a chosen implementation or a clone
  const [newIndexer, setNewIndexer] = useState<Indexer | undefined>();

  const showPriority = items.some((index) => index.priority !== 25);

  const handleAddIndexerPress = useCallback(() => {
    setIsAddIndexerModalOpen(true);
  }, []);

  const handleCloneIndexerPress = useCallback(
    (id: number) => {
      const indexer = items.find((item) => item.id === id);

      if (indexer) {
        setNewIndexer(getClonedIndexer(indexer));
        setIsEditIndexerModalOpen(true);
      }
    },
    [items]
  );

  const handleIndexerSelect = useCallback((indexer: Indexer) => {
    setNewIndexer(indexer);
    setIsAddIndexerModalOpen(false);
    setIsEditIndexerModalOpen(true);
  }, []);

  const handleAddIndexerModalClose = useCallback(() => {
    setIsAddIndexerModalOpen(false);
  }, []);

  const handleEditIndexerModalClose = useCallback(() => {
    setIsEditIndexerModalOpen(false);
  }, []);

  return (
    <FieldSet legend={translate('Indexers')}>
      <PageSectionContent
        errorMessage={translate('IndexersLoadError')}
        error={error ?? undefined}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.indexers}>
          {items.map((item) => {
            return (
              <IndexerComponent
                key={item.id}
                {...item}
                showPriority={showPriority}
                onCloneIndexerPress={handleCloneIndexerPress}
              />
            );
          })}

          <Card className={styles.addIndexer} onPress={handleAddIndexerPress}>
            <div className={styles.center}>
              <Icon name={icons.ADD} size={45} />
            </div>
          </Card>
        </div>

        <AddIndexerModal
          isOpen={isAddIndexerModalOpen}
          onIndexerSelect={handleIndexerSelect}
          onModalClose={handleAddIndexerModalClose}
        />

        <EditIndexerModal
          isOpen={isEditIndexerModalOpen}
          defaultIndexer={newIndexer}
          onModalClose={handleEditIndexerModalClose}
        />
      </PageSectionContent>
    </FieldSet>
  );
}

export default Indexers;
