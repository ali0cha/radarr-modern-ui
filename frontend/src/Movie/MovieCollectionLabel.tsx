import React, { useCallback } from 'react';
import {
  useCollectionByTmdbId,
  useToggleCollectionMonitored,
} from 'Collection/useMovieCollections';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import translate from 'Utilities/String/translate';
import styles from './MovieCollectionLabel.module.css';

interface MovieCollectionLabelProps {
  tmdbId: number;
}

function MovieCollectionLabel({ tmdbId }: MovieCollectionLabelProps) {
  const collection = useCollectionByTmdbId(tmdbId);
  const { id, monitored, title } = collection ?? {
    id: 0,
    monitored: false,
    title: '',
  };

  const { toggleMonitored, isSaving } = useToggleCollectionMonitored(id);

  const handleMonitorTogglePress = useCallback(
    (value: boolean) => {
      toggleMonitored(value);
    },
    [toggleMonitored]
  );

  if (!id) {
    return translate('Unknown');
  }

  return (
    <div>
      <MonitorToggleButton
        className={styles.monitorToggleButton}
        monitored={monitored}
        isSaving={isSaving}
        size={15}
        onPress={handleMonitorTogglePress}
      />
      {title}
    </div>
  );
}

export default MovieCollectionLabel;
