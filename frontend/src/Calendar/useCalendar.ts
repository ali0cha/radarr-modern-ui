import { keepPreviousData, QueryClient } from '@tanstack/react-query';
import { get, times } from 'lodash';
import moment from 'moment';
import { useMemo } from 'react';
import { Filter } from 'App/State/AppState';
import * as calendarViews from 'Calendar/calendarViews';
import { CalendarView } from 'Calendar/calendarViews';
import { useCustomFilters } from 'Components/Filter/useCustomFilters';
import { createPersist } from 'Helpers/createPersist';
import useApiQuery, { getApiPath } from 'Helpers/Hooks/useApiQuery';
import {
  filterBuilderTypes,
  filterBuilderValueTypes,
  filterTypes,
} from 'Helpers/Props';
import useUISettings from 'Settings/UI/useUISettings';
import { CalendarItem } from 'typings/Calendar';
import findSelectedFilters from 'Utilities/Filter/findSelectedFilters';
import translate from 'Utilities/String/translate';

export const CALENDAR_PATH = '/calendar';

interface CalendarOptions {
  showMovieInformation: boolean;
  showCinemaRelease: boolean;
  showDigitalRelease: boolean;
  showPhysicalRelease: boolean;
  showCutoffUnmetIcon: boolean;
  fullColorEvents: boolean;
}

interface CalendarState {
  view: CalendarView;
  selectedFilterKey: string | number;
  options: CalendarOptions;
  // The day that is shown, and how many days the forecast shows
  time: string;
  dayCount: number;
  searchMissingCommandId: number | null;
}

interface CalendarActions {
  setView: (view: CalendarView) => void;
  setFilter: (selectedFilterKey: string | number) => void;
  setOptions: (options: Partial<CalendarOptions>) => void;
  setDayCount: (dayCount: number) => void;
  gotoToday: () => void;
  gotoPreviousRange: () => void;
  gotoNextRange: () => void;
  setSearchMissingCommandId: (id: number | null) => void;
}

const viewRanges: Record<string, moment.unitOfTime.DurationConstructor> = {
  [calendarViews.DAY]: 'day',
  [calendarViews.WEEK]: 'week',
  [calendarViews.MONTH]: 'month',
  [calendarViews.FORECAST]: 'day',
};

const PERSISTED_KEYS = ['view', 'selectedFilterKey', 'options'] as const;

// The view, the filter and the options are saved like they were in the Redux
// section of the same name.
export const useCalendarStore = createPersist<CalendarState & CalendarActions>(
  'calendar',
  (set) => ({
    view: (window.innerWidth > 768 ? 'month' : 'day') as CalendarView,
    selectedFilterKey: 'monitored',
    options: {
      showMovieInformation: true,
      showCinemaRelease: true,
      showDigitalRelease: true,
      showPhysicalRelease: true,
      showCutoffUnmetIcon: false,
      fullColorEvents: false,
    },
    time: moment().toISOString(),
    dayCount: 7,
    searchMissingCommandId: null,

    // Changing the view shows today again
    setView: (view) => set({ view, time: moment().toISOString() }),
    setFilter: (selectedFilterKey) => set({ selectedFilterKey }),
    setOptions: (options) =>
      set((state) => ({ options: { ...state.options, ...options } })),
    setDayCount: (dayCount) => set({ dayCount }),
    gotoToday: () => set({ time: moment().toISOString() }),
    gotoPreviousRange: () =>
      set((state) => {
        const amount =
          state.view === calendarViews.FORECAST ? state.dayCount : 1;

        return {
          time: moment(state.time)
            .subtract(amount, viewRanges[state.view])
            .toISOString(),
        };
      }),
    gotoNextRange: () =>
      set((state) => {
        const amount =
          state.view === calendarViews.FORECAST ? state.dayCount : 1;

        return {
          time: moment(state.time)
            .add(amount, viewRanges[state.view])
            .toISOString(),
        };
      }),
    setSearchMissingCommandId: (searchMissingCommandId) =>
      set({ searchMissingCommandId }),
  }),
  {
    partialize: (state) =>
      Object.fromEntries(
        PERSISTED_KEYS.map((key) => [key, state[key]])
      ) as unknown as CalendarState & CalendarActions,
    merge: (persisted, current) => {
      const saved = (persisted ?? {}) as Partial<CalendarState>;

      return {
        ...current,
        ...saved,
        options: { ...current.options, ...saved.options },
      };
    },
    migrateFromLegacy: (legacyState) => {
      const legacy = get(legacyState, 'calendar') as
        | Record<string, unknown>
        | undefined;

      if (!legacy) {
        return undefined;
      }

      const migrated: Record<string, unknown> = {};

      PERSISTED_KEYS.forEach((key) => {
        if (legacy[key] !== undefined) {
          migrated[key] = legacy[key];
        }
      });

      return migrated as Partial<CalendarState & CalendarActions>;
    },
  }
);

export const calendarFilters: Filter[] = [
  {
    key: 'all',
    label: () => translate('All'),
    filters: [{ key: 'unmonitored', value: [true], type: filterTypes.EQUAL }],
  },
  {
    key: 'monitored',
    label: () => translate('MonitoredOnly'),
    filters: [{ key: 'unmonitored', value: [false], type: filterTypes.EQUAL }],
  },
];

export const calendarFilterBuilderProps = [
  {
    name: 'unmonitored',
    label: () => translate('IncludeUnmonitored'),
    type: filterBuilderTypes.EQUAL,
    valueType: filterBuilderValueTypes.BOOL,
  },
  {
    name: 'tags',
    label: () => translate('Tags'),
    type: filterBuilderTypes.CONTAINS,
    valueType: filterBuilderValueTypes.TAG,
  },
];

function getDays(start: moment.Moment, end: moment.Moment) {
  const difference = end.diff(start, 'days');

  // Difference is one less than the number of days we need to account for.
  return times(difference + 1, (i) =>
    start.clone().add(i, 'days').toISOString()
  );
}

// The days that are shown for a time and a view
export function getDates(
  time: moment.Moment,
  view: CalendarView,
  firstDayOfWeek: number,
  dayCount: number
) {
  const weekName = firstDayOfWeek === 0 ? 'week' : 'isoWeek';

  let start = time.clone().startOf('day');
  let end = time.clone().endOf('day');

  if (view === calendarViews.WEEK) {
    start = time.clone().startOf(weekName);
    end = time.clone().endOf(weekName);
  }

  if (view === calendarViews.FORECAST) {
    start = time.clone().subtract(1, 'day').startOf('day');
    end = time
      .clone()
      .add(dayCount - 2, 'days')
      .endOf('day');
  }

  if (view === calendarViews.MONTH) {
    start = time.clone().startOf('month').startOf(weekName);
    end = time.clone().endOf('month').endOf(weekName);
  }

  if (view === calendarViews.AGENDA) {
    start = time.clone().subtract(1, 'day').startOf('day');
    end = time.clone().add(1, 'month').endOf('day');
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    dates: getDays(start, end),
  };
}

// The movies of a little more than the days shown are fetched, so that moving
// a day or a week does not leave empty days
function getPopulatableRange(
  startDate: string,
  endDate: string,
  view: CalendarView
) {
  switch (view) {
    case calendarViews.DAY:
      return {
        start: moment(startDate).subtract(1, 'day').toISOString(),
        end: moment(endDate).add(1, 'day').toISOString(),
      };
    case calendarViews.WEEK:
    case calendarViews.FORECAST:
      return {
        start: moment(startDate).subtract(1, 'week').toISOString(),
        end: moment(endDate).add(1, 'week').toISOString(),
      };
    default:
      return { start: startDate, end: endDate };
  }
}

const NO_ITEMS: CalendarItem[] = [];

// What the calendar shows: the days of the time and the view that were chosen,
// and the movies that are released on them. The movies of the previous days
// stay while the new ones are fetched.
export function useCalendar() {
  const store = useCalendarStore();
  const { firstDayOfWeek } = useUISettings();

  const { customFilters: allCustomFilters } = useCustomFilters();

  const customFilters = useMemo(
    () => allCustomFilters.filter(({ type }) => type === 'calendar'),
    [allCustomFilters]
  );

  const { start, end, dates } = useMemo(
    () =>
      getDates(moment(store.time), store.view, firstDayOfWeek, store.dayCount),
    [store.time, store.view, firstDayOfWeek, store.dayCount]
  );

  const path = useMemo(() => {
    const range = getPopulatableRange(start, end, store.view);
    const selectedFilters = findSelectedFilters(
      store.selectedFilterKey,
      calendarFilters,
      customFilters
    ) as { key: string; value: (boolean | string | number)[] }[];

    const params = new URLSearchParams({ start: range.start, end: range.end });
    let unmonitored = false;

    selectedFilters.forEach((filter) => {
      if (filter.key === 'unmonitored') {
        unmonitored = filter.value.includes(true);
      }

      if (filter.key === 'tags') {
        params.set('tags', filter.value.join(','));
      }
    });

    params.set('unmonitored', String(unmonitored));

    return `${CALENDAR_PATH}?${params.toString()}`;
  }, [start, end, store.view, store.selectedFilterKey, customFilters]);

  const { data, isFetching, isSuccess, error, refetch } = useApiQuery<
    CalendarItem[]
  >({
    path,
    queryOptions: {
      retry: false,
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
    },
  });

  return {
    ...store,
    filters: calendarFilters,
    filterBuilderProps: calendarFilterBuilderProps,
    customFilters,
    start,
    end,
    dates,
    items: data ?? NO_ITEMS,
    isFetching,
    isPopulated: isSuccess,
    error,
    refetch,
  };
}

// SignalR says that a movie of the calendar changed
export function updateCalendarItem(
  queryClient: QueryClient,
  movie: Partial<CalendarItem> & { id: number }
) {
  const prefix = getApiPath(CALENDAR_PATH);

  queryClient
    .getQueryCache()
    .findAll({
      predicate: ({ queryKey }) =>
        typeof queryKey[0] === 'string' && queryKey[0].startsWith(prefix),
    })
    .forEach(({ queryKey }) => {
      queryClient.setQueryData<CalendarItem[]>(queryKey, (items) =>
        items?.map((item) =>
          item.id === movie.id ? { ...item, ...movie } : item
        )
      );
    });
}
