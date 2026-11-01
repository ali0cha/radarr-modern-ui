import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { invalidateQueueDetails } from 'Activity/Queue/useQueue';
import { useCalendar, useCalendarStore } from 'Calendar/useCalendar';
import * as commandNames from 'Commands/commandNames';
import { useCommandExecuting } from 'Commands/useCommands';
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import useCurrentPage from 'Helpers/Hooks/useCurrentPage';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { kinds } from 'Helpers/Props';
import Movie from 'Movie/Movie';
import { useMovieFilesByIds } from 'MovieFile/useMovieFiles';
import selectUniqueIds from 'Utilities/Object/selectUniqueIds';
import {
  registerPagePopulator,
  unregisterPagePopulator,
} from 'Utilities/pagePopulator';
import translate from 'Utilities/String/translate';
import Agenda from './Agenda/Agenda';
import CalendarDays from './Day/CalendarDays';
import DaysOfWeek from './Day/DaysOfWeek';
import CalendarHeader from './Header/CalendarHeader';
import styles from './Calendar.module.css';

const UPDATE_DELAY = 3600000; // 1 hour

function Calendar() {
  const queryClient = useQueryClient();
  const requestCurrentPage = useCurrentPage();
  const updateTimeout = useRef<ReturnType<typeof setTimeout>>();

  const { isFetching, isPopulated, error, items, time, view, refetch } =
    useCalendar();
  const gotoToday = useCalendarStore((state) => state.gotoToday);

  const isRefreshingMovie = useCommandExecuting(commandNames.REFRESH_MOVIE);

  const wasRefreshingMovie = usePrevious(isRefreshingMovie);

  // The calendar goes to the next day when the day is over
  const handleScheduleUpdate = useCallback(() => {
    clearTimeout(updateTimeout.current);

    function updateCalendar() {
      gotoToday();
      updateTimeout.current = setTimeout(updateCalendar, UPDATE_DELAY);
    }

    updateTimeout.current = setTimeout(updateCalendar, UPDATE_DELAY);
  }, [gotoToday]);

  useEffect(() => {
    handleScheduleUpdate();

    return () => {
      clearTimeout(updateTimeout.current);
    };
  }, [handleScheduleUpdate]);

  // The calendar shows today when it is opened, but not when going back to it
  useEffect(() => {
    if (!requestCurrentPage) {
      gotoToday();
    }
  }, [requestCurrentPage, gotoToday]);

  useEffect(() => {
    const repopulate = () => {
      invalidateQueueDetails(queryClient);
      refetch();
    };

    registerPagePopulator(repopulate, ['movieFileUpdated', 'movieFileDeleted']);

    return () => {
      unregisterPagePopulator(repopulate);
    };
  }, [queryClient, refetch]);

  useEffect(() => {
    handleScheduleUpdate();
  }, [time, handleScheduleUpdate]);

  useEffect(() => {
    if (wasRefreshingMovie && !isRefreshingMovie) {
      refetch();
    }
  }, [isRefreshingMovie, wasRefreshingMovie, refetch]);

  const movieFileIds = useMemo(
    () => selectUniqueIds<Movie, number>(items, 'movieFileId'),
    [items]
  );

  useMovieFilesByIds(movieFileIds);

  return (
    <div className={styles.calendar}>
      {isFetching && !isPopulated ? <LoadingIndicator /> : null}

      {!isFetching && error ? (
        <Alert kind={kinds.DANGER}>{translate('CalendarLoadError')}</Alert>
      ) : null}

      {!error && isPopulated && view === 'agenda' ? (
        <div className={styles.calendarContent}>
          <CalendarHeader />
          <Agenda />
        </div>
      ) : null}

      {!error && isPopulated && view !== 'agenda' ? (
        <div className={styles.calendarContent}>
          <CalendarHeader />
          <DaysOfWeek />
          <CalendarDays />
        </div>
      ) : null}
    </div>
  );
}

export default Calendar;
