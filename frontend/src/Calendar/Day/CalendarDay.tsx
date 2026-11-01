import classNames from 'classnames';
import moment from 'moment';
import React, { useMemo } from 'react';
import * as calendarViews from 'Calendar/calendarViews';
import CalendarEvent from 'Calendar/Events/CalendarEvent';
import { useCalendar } from 'Calendar/useCalendar';
import { CalendarEvent as CalendarEventModel } from 'typings/Calendar';
import styles from './CalendarDay.module.css';

function sort(items: CalendarEventModel[]) {
  return items.sort((a, b) => {
    const aDate = moment(a.inCinemas).unix();
    const bDate = moment(b.inCinemas).unix();

    return aDate - bDate;
  });
}

function getCalendarEvents(
  items: CalendarEventModel[],
  options: {
    showCinemaRelease: boolean;
    showDigitalRelease: boolean;
    showPhysicalRelease: boolean;
  },
  date: string
) {
  const { showCinemaRelease, showDigitalRelease, showPhysicalRelease } =
    options;
  const momentDate = moment(date);

  const filtered = items.filter(
    ({ inCinemas, digitalRelease, physicalRelease }) => {
      return (
        (showCinemaRelease &&
          inCinemas &&
          momentDate.isSame(moment(inCinemas), 'day')) ||
        (showDigitalRelease &&
          digitalRelease &&
          momentDate.isSame(moment(digitalRelease), 'day')) ||
        (showPhysicalRelease &&
          physicalRelease &&
          momentDate.isSame(moment(physicalRelease), 'day'))
      );
    }
  );

  return sort(filtered);
}

interface CalendarDayProps {
  date: string;
  isTodaysDate: boolean;
}

function CalendarDay({ date, isTodaysDate }: CalendarDayProps) {
  const { time, view, items, options } = useCalendar();
  const events = useMemo(
    () => getCalendarEvents(items, options, date),
    [items, options, date]
  );

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isTodaysDate && view === calendarViews.MONTH && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [time, isTodaysDate, view]);

  return (
    <div
      ref={ref}
      className={classNames(
        styles.day,
        view === calendarViews.DAY && styles.isSingleDay
      )}
    >
      {view === calendarViews.MONTH && (
        <div
          className={classNames(
            styles.dayOfMonth,
            isTodaysDate && styles.isToday,
            !moment(date).isSame(moment(time), 'month') &&
              styles.isDifferentMonth
          )}
        >
          {moment(date).date()}
        </div>
      )}
      <div>
        {events.map((event) => {
          return (
            <CalendarEvent key={event.id} {...event} date={date as string} />
          );
        })}
      </div>
    </div>
  );
}

export default CalendarDay;
