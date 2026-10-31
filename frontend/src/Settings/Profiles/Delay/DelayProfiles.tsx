import React, { useCallback, useState } from 'react';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import Measure from 'Components/Measure';
import PageSectionContent from 'Components/Page/PageSectionContent';
import Scroller from 'Components/Scroller/Scroller';
import { icons, scrollDirections } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import DelayProfile from './DelayProfile';
import DelayProfileDragPreview from './DelayProfileDragPreview';
import DelayProfileDragSource from './DelayProfileDragSource';
import EditDelayProfileModal from './EditDelayProfileModal';
import { useDelayProfiles, useReorderDelayProfile } from './useDelayProfiles';
import styles from './DelayProfiles.module.css';

function DelayProfiles() {
  const { defaultProfile, items, isFetching, isPopulated, error } =
    useDelayProfiles();
  const reorderDelayProfile = useReorderDelayProfile();

  const [isAddDelayProfileModalOpen, setIsAddDelayProfileModalOpen] =
    useState(false);
  const [width, setWidth] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleAddDelayProfilePress = useCallback(() => {
    setIsAddDelayProfileModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsAddDelayProfileModalOpen(false);
  }, []);

  const handleMeasure = useCallback(({ width }: { width: number }) => {
    setWidth(width);
  }, []);

  const handleDelayProfileDragMove = useCallback(
    (newDragIndex: number, newDropIndex: number) => {
      if (dragIndex !== newDragIndex || dropIndex !== newDropIndex) {
        setDragIndex(newDragIndex);
        setDropIndex(newDropIndex);
      }
    },
    [dragIndex, dropIndex]
  );

  const handleDelayProfileDragEnd = useCallback(
    ({ id }: { id: number }, didDrop: boolean) => {
      if (didDrop && dropIndex !== null) {
        reorderDelayProfile(
          defaultProfile ? [defaultProfile, ...items] : items,
          id,
          dropIndex - 1
        );
      }

      setDragIndex(null);
      setDropIndex(null);
    },
    [defaultProfile, items, dropIndex, reorderDelayProfile]
  );

  const isDragging = dropIndex !== null;
  const isDraggingUp =
    isDragging && dragIndex !== null && dropIndex < dragIndex;
  const isDraggingDown =
    isDragging && dragIndex !== null && dropIndex > dragIndex;

  return (
    <Measure onMeasure={handleMeasure}>
      <FieldSet legend={translate('DelayProfiles')}>
        <PageSectionContent
          errorMessage={translate('DelayProfilesLoadError')}
          error={error ?? undefined}
          isFetching={isFetching}
          isPopulated={isPopulated}
        >
          <Scroller
            className={styles.horizontalScroll}
            scrollDirection={scrollDirections.HORIZONTAL}
            autoFocus={false}
          >
            <div>
              <div className={styles.delayProfilesHeader}>
                <div className={styles.column}>
                  {translate('PreferredProtocol')}
                </div>
                <div className={styles.column}>{translate('UsenetDelay')}</div>
                <div className={styles.column}>{translate('TorrentDelay')}</div>
                <div className={styles.tags}>{translate('Tags')}</div>
              </div>

              <div className={styles.delayProfiles}>
                {items.map((item, index) => {
                  return (
                    <DelayProfileDragSource
                      key={item.id}
                      {...item}
                      index={index}
                      isDragging={isDragging}
                      isDraggingUp={isDraggingUp}
                      isDraggingDown={isDraggingDown}
                      onDelayProfileDragMove={handleDelayProfileDragMove}
                      onDelayProfileDragEnd={handleDelayProfileDragEnd}
                    />
                  );
                })}

                <DelayProfileDragPreview width={width} />
              </div>

              {defaultProfile ? (
                <div>
                  <DelayProfile isDragging={false} {...defaultProfile} />
                </div>
              ) : null}
            </div>
          </Scroller>

          <div className={styles.addDelayProfile}>
            <Link
              className={styles.addButton}
              onPress={handleAddDelayProfilePress}
            >
              <Icon name={icons.ADD} />
            </Link>
          </div>

          <EditDelayProfileModal
            isOpen={isAddDelayProfileModalOpen}
            onModalClose={handleModalClose}
          />
        </PageSectionContent>
      </FieldSet>
    </Measure>
  );
}

export default DelayProfiles;
