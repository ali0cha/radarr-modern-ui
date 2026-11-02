import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { useDimensions } from 'App/useAppStore';
import { CalendarView } from 'Calendar/calendarViews';
import { useCalendar, useCalendarStore } from 'Calendar/useCalendar';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Menu from 'Components/Menu/Menu';
import MenuButton from 'Components/Menu/MenuButton';
import MenuContent from 'Components/Menu/MenuContent';
import ViewMenuItem from 'Components/Menu/ViewMenuItem';
import { align, icons } from 'Helpers/Props';
import useUISettings from 'Settings/UI/useUISettings';
import translate from 'Utilities/String/translate';
import CalendarHeaderViewButton from './CalendarHeaderViewButton';
import styles from './CalendarHeader.module.css';

function getNavigationLabels(view: CalendarView) {
  if (view === 'month') {
    return {
      previous: translate('CalendarGoToPreviousMonth'),
      next: translate('CalendarGoToNextMonth'),
    };
  }

  if (view === 'week') {
    return {
      previous: translate('CalendarGoToPreviousWeek'),
      next: translate('CalendarGoToNextWeek'),
    };
  }

  if (view === 'day') {
    return {
      previous: translate('CalendarGoToPreviousDay'),
      next: translate('CalendarGoToNextDay'),
    };
  }

  return {
    previous: translate('CalendarGoToPreviousRange'),
    next: translate('CalendarGoToNextRange'),
  };
}

function CalendarHeader() {
  const { isFetching, view, time, start, end } = useCalendar();
  const setView = useCalendarStore((state) => state.setView);
  const gotoToday = useCalendarStore((state) => state.gotoToday);
  const gotoPreviousRange = useCalendarStore(
    (state) => state.gotoPreviousRange
  );
  const gotoNextRange = useCalendarStore((state) => state.gotoNextRange);

  const { isSmallScreen, isLargeScreen } = useDimensions();

  const { longDateFormat } = useUISettings();
  const navigationLabels = getNavigationLabels(view);

  const handleViewChange = useCallback(
    (newView: string) => {
      setView(newView as CalendarView);
    },
    [setView]
  );

  const handleTodayPress = useCallback(() => {
    gotoToday();
  }, [gotoToday]);

  const handlePreviousPress = useCallback(() => {
    gotoPreviousRange();
  }, [gotoPreviousRange]);

  const handleNextPress = useCallback(() => {
    gotoNextRange();
  }, [gotoNextRange]);

  const title = useMemo(() => {
    const timeMoment = moment(time);
    const startMoment = moment(start);
    const endMoment = moment(end);

    if (view === 'day') {
      return timeMoment.format(longDateFormat);
    } else if (view === 'month') {
      return timeMoment.format('MMMM YYYY');
    } else if (view === 'agenda') {
      return translate('Agenda');
    }

    let startFormat = 'MMM D YYYY';
    let endFormat = 'MMM D YYYY';

    if (startMoment.isSame(endMoment, 'month')) {
      startFormat = 'MMM D';
      endFormat = 'D YYYY';
    } else if (startMoment.isSame(endMoment, 'year')) {
      startFormat = 'MMM D';
      endFormat = 'MMM D YYYY';
    }

    return `${startMoment.format(startFormat)} \u2014 ${endMoment.format(
      endFormat
    )}`;
  }, [time, start, end, view, longDateFormat]);

  return (
    <div>
      {isSmallScreen ? <div className={styles.titleMobile}>{title}</div> : null}

      <div className={styles.header}>
        <div className={styles.navigationButtons}>
          <Link
            className={styles.navButton}
            isDisabled={view === 'agenda'}
            aria-label={navigationLabels.previous}
            onPress={handlePreviousPress}
          >
            <Icon name={icons.PAGE_PREVIOUS} />
          </Link>

          <Link
            className={styles.navButton}
            isDisabled={view === 'agenda'}
            aria-label={navigationLabels.next}
            onPress={handleNextPress}
          >
            <Icon name={icons.PAGE_NEXT} />
          </Link>

          <Link
            className={styles.todayButton}
            isDisabled={view === 'agenda'}
            onPress={handleTodayPress}
          >
            {translate('Today')}
          </Link>
        </div>

        {isSmallScreen ? null : (
          <div className={styles.titleDesktop}>{title}</div>
        )}

        <div className={styles.viewButtonsContainer}>
          {isFetching ? (
            <LoadingIndicator className={styles.loading} size={20} />
          ) : null}

          {isLargeScreen ? (
            <Menu className={styles.viewMenu} alignMenu={align.RIGHT}>
              <MenuButton aria-label={translate('CalendarView')}>
                <Icon name={icons.VIEW} size={22} />
              </MenuButton>

              <MenuContent>
                {isSmallScreen ? null : (
                  <ViewMenuItem
                    name="month"
                    selectedView={view}
                    onPress={handleViewChange}
                  >
                    {translate('Month')}
                  </ViewMenuItem>
                )}

                <ViewMenuItem
                  name="week"
                  selectedView={view}
                  onPress={handleViewChange}
                >
                  {translate('Week')}
                </ViewMenuItem>

                <ViewMenuItem
                  name="forecast"
                  selectedView={view}
                  onPress={handleViewChange}
                >
                  {translate('Forecast')}
                </ViewMenuItem>

                <ViewMenuItem
                  name="day"
                  selectedView={view}
                  onPress={handleViewChange}
                >
                  {translate('Day')}
                </ViewMenuItem>

                <ViewMenuItem
                  name="agenda"
                  selectedView={view}
                  onPress={handleViewChange}
                >
                  {translate('Agenda')}
                </ViewMenuItem>
              </MenuContent>
            </Menu>
          ) : (
            <>
              <CalendarHeaderViewButton
                className={styles.viewButton}
                view="month"
                selectedView={view}
                onPress={handleViewChange}
              />

              <CalendarHeaderViewButton
                className={styles.viewButton}
                view="week"
                selectedView={view}
                onPress={handleViewChange}
              />

              <CalendarHeaderViewButton
                className={styles.viewButton}
                view="forecast"
                selectedView={view}
                onPress={handleViewChange}
              />

              <CalendarHeaderViewButton
                className={styles.viewButton}
                view="day"
                selectedView={view}
                onPress={handleViewChange}
              />

              <CalendarHeaderViewButton
                className={styles.viewButton}
                view="agenda"
                selectedView={view}
                onPress={handleViewChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarHeader;
