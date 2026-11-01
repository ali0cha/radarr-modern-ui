import React, { useCallback } from 'react';
import Icon from 'Components/Icon';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import VirtualTableRowCell from 'Components/Table/Cells/TableRowCell';
import { icons } from 'Helpers/Props';
import getMovieStatusDetails from 'Movie/getMovieStatusDetails';
import { MovieStatus } from 'Movie/Movie';
import { useToggleMovieMonitored } from 'Movie/useMovies';
import translate from 'Utilities/String/translate';
import styles from './MovieStatusCell.module.css';

interface MovieStatusCellProps {
  className: string;
  movieId: number;
  monitored: boolean;
  status: MovieStatus;
  isSelectMode: boolean;
  component?: React.ElementType;
}

function MovieStatusCell(props: MovieStatusCellProps) {
  const {
    className,
    movieId,
    monitored,
    status,
    isSelectMode,
    component: Component = VirtualTableRowCell,
    ...otherProps
  } = props;

  const statusDetails = getMovieStatusDetails(status);

  const { toggleMonitored, isSaving } = useToggleMovieMonitored(movieId);

  const onMonitoredPress = useCallback(() => {
    toggleMonitored(!monitored);
  }, [monitored, toggleMonitored]);

  return (
    <Component className={className} {...otherProps}>
      {isSelectMode ? (
        <MonitorToggleButton
          className={styles.statusIcon}
          monitored={monitored}
          isSaving={isSaving}
          onPress={onMonitoredPress}
        />
      ) : (
        <Icon
          className={styles.statusIcon}
          name={monitored ? icons.MONITORED : icons.UNMONITORED}
          title={
            monitored
              ? translate('MovieIsMonitored')
              : translate('MovieIsUnmonitored')
          }
        />
      )}

      <Icon
        className={styles.statusIcon}
        name={statusDetails.icon}
        title={`${statusDetails.title}: ${statusDetails.message}`}
      />
    </Component>
  );
}

export default MovieStatusCell;
