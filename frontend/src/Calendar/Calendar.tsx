import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { invalidateQueueDetails } from 'Activity/Queue/useQueue';
import AppState from 'App/State/AppState';
import * as commandNames from 'Commands/commandNames';
import { useCommandExecuting } from 'Commands/useCommands';
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import useCurrentPage from 'Helpers/Hooks/useCurrentPage';
import usePrevious from 'Helpers/Hooks/usePrevious';
import { kinds } from 'Helpers/Props';
import Movie from 'Movie/Movie';
import useUISettings from 'Settings/UI/useUISettings';
import {
  clearCalendar,
  fetchCalendar,
  gotoCalendarToday,
} from 'Store/Actions/calendarActions';
import {
  clearMovieFiles,
  fetchMovieFiles,
} from 'Store/Actions/movieFileActions';
import hasDifferentItems from 'Utilities/Object/hasDifferentItems';
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
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const requestCurrentPage = useCurrentPage();
  const updateTimeout = useRef<ReturnType<typeof setTimeout>>();

  const { isFetching, isPopulated, error, items, time, view } = useSelector(
    (state: AppState) => state.calendar
  );

  const isRefreshingMovie = useCommandExecuting(commandNames.REFRESH_MOVIE);

  const { firstDayOfWeek } = useUISettings();

  const wasRefreshingMovie = usePrevious(isRefreshingMovie);
  const previousFirstDayOfWeek = usePrevious(firstDayOfWeek);
  const previousItems = usePrevious(items);

  const handleScheduleUpdate = useCallback(() => {
    clearTimeout(updateTimeout.current);

    function updateCalendar() {
      dispatch(gotoCalendarToday());
      updateTimeout.current = setTimeout(updateCalendar, UPDATE_DELAY);
    }

    updateTimeout.current = setTimeout(updateCalendar, UPDATE_DELAY);
  }, [dispatch]);

  useEffect(() => {
    handleScheduleUpdate();

    return () => {
      dispatch(clearCalendar());
      dispatch(clearMovieFiles());
      clearTimeout(updateTimeout.current);
    };
  }, [dispatch, handleScheduleUpdate]);

  useEffect(() => {
    if (requestCurrentPage) {
      dispatch(fetchCalendar());
    } else {
      dispatch(gotoCalendarToday());
    }
  }, [requestCurrentPage, dispatch]);

  useEffect(() => {
    const repopulate = () => {
      invalidateQueueDetails(queryClient);
      dispatch(fetchCalendar({ time, view }));
    };

    registerPagePopulator(repopulate, ['movieFileUpdated', 'movieFileDeleted']);

    return () => {
      unregisterPagePopulator(repopulate);
    };
  }, [time, view, queryClient, dispatch]);

  useEffect(() => {
    handleScheduleUpdate();
  }, [time, handleScheduleUpdate]);

  useEffect(() => {
    if (
      previousFirstDayOfWeek != null &&
      firstDayOfWeek !== previousFirstDayOfWeek
    ) {
      dispatch(fetchCalendar({ time, view }));
    }
  }, [time, view, firstDayOfWeek, previousFirstDayOfWeek, dispatch]);

  useEffect(() => {
    if (wasRefreshingMovie && !isRefreshingMovie) {
      dispatch(fetchCalendar({ time, view }));
    }
  }, [time, view, isRefreshingMovie, wasRefreshingMovie, dispatch]);

  useEffect(() => {
    if (!previousItems || hasDifferentItems(items, previousItems)) {
      const movieFileIds = selectUniqueIds<Movie, number>(items, 'movieFileId');

      if (movieFileIds.length) {
        dispatch(fetchMovieFiles({ movieFileIds }));
      }
    }
  }, [items, previousItems, dispatch]);

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
