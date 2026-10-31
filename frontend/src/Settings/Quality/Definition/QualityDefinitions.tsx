import React, { useCallback, useEffect } from 'react';
import FieldSet from 'Components/FieldSet';
import PageSectionContent from 'Components/Page/PageSectionContent';
import useShowAdvancedSettings from 'Helpers/Hooks/useShowAdvancedSettings';
import QualityDefinitionModel from 'typings/QualityDefinition';
import translate from 'Utilities/String/translate';
import QualityDefinition from './QualityDefinition';
import { useManageQualityDefinitions } from './useQualityDefinitions';
import styles from './QualityDefinitions.module.css';

interface QualityDefinitionsProps {
  onChildMounted: (saveCallback: () => void) => void;
  onChildStateChange: (change: {
    isSaving: boolean;
    hasPendingChanges: boolean;
  }) => void;
}

interface SizeChange {
  minSize: number;
  maxSize: number | null;
  preferredSize: number | null;
}

function QualityDefinitions({
  onChildMounted,
  onChildStateChange,
}: QualityDefinitionsProps) {
  const advancedSettings = useShowAdvancedSettings();

  const {
    items,
    isFetching,
    isPopulated,
    error,
    hasPendingChanges,
    isSaving,
    updateValue,
    save,
  } = useManageQualityDefinitions();

  const handleTitleChange = useCallback(
    (id: number) =>
      ({ value }: { value: string }) => {
        updateValue(id, 'title', value);
      },
    [updateValue]
  );

  const handleSizeChange = useCallback(
    (item: QualityDefinitionModel) =>
      ({ minSize, maxSize, preferredSize }: SizeChange) => {
        if (minSize !== item.minSize) {
          updateValue(item.id, 'minSize', minSize);
        }

        if (maxSize !== item.maxSize) {
          updateValue(item.id, 'maxSize', maxSize);
        }

        if (preferredSize !== item.preferredSize) {
          updateValue(item.id, 'preferredSize', preferredSize);
        }
      },
    [updateValue]
  );

  useEffect(() => {
    onChildMounted(save);
  }, [save, onChildMounted]);

  useEffect(() => {
    onChildStateChange({ isSaving, hasPendingChanges });
  }, [isSaving, hasPendingChanges, onChildStateChange]);

  return (
    <FieldSet legend={translate('QualityDefinitions')}>
      <PageSectionContent
        errorMessage={translate('QualityDefinitionsLoadError')}
        error={error ?? undefined}
        isFetching={isFetching}
        isPopulated={isPopulated}
      >
        <div className={styles.header}>
          <div className={styles.quality}>{translate('Quality')}</div>

          <div className={styles.title}>{translate('Title')}</div>

          <div className={styles.sizeLimit}>{translate('SizeLimit')}</div>

          {advancedSettings ? (
            <div className={styles.megabytesPerMinute}>
              {translate('MegabytesPerMinute')}
            </div>
          ) : null}
        </div>

        <div className={styles.definitions}>
          {items.map((item) => {
            return (
              <QualityDefinition
                key={item.id}
                {...item}
                advancedSettings={advancedSettings}
                onTitleChange={handleTitleChange(item.id)}
                onSizeChange={handleSizeChange(item)}
              />
            );
          })}
        </div>

        <div className={styles.sizeLimitHelpTextContainer}>
          <div className={styles.sizeLimitHelpText}>
            {translate('QualityLimitsMovieRuntimeHelpText')}
          </div>
        </div>
      </PageSectionContent>
    </FieldSet>
  );
}

export default QualityDefinitions;
