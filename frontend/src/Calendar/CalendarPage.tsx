import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useQueueDetails } from 'Activity/Queue/useQueue';
import AppState from 'App/State/AppState';
import * as commandNames from 'Commands/commandNames';
import {
  executeCommand,
  useCommandExecuting,
  useCommands,
} from 'Commands/useCommands';
import FilterMenu from 'Components/Menu/FilterMenu';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import useMeasure from 'Helpers/Hooks/useMeasure';
import { align, icons } from 'Helpers/Props';
import NoMovie from 'Movie/NoMovie';
import { useMovieCount } from 'Movie/useMovies';
import {
  searchMissing,
  setCalendarDaysCount,
  setCalendarFilter,
} from 'Store/Actions/calendarActions';
import { createCustomFiltersSelector } from 'Store/Selectors/createClientSideCollectionSelector';
import { isCommandExecuting } from 'Utilities/Command';
import isBefore from 'Utilities/Date/isBefore';
import translate from 'Utilities/String/translate';
import Calendar from './Calendar';
import CalendarFilterModal from './CalendarFilterModal';
import CalendarLinkModal from './iCal/CalendarLinkModal';
import Legend from './Legend/Legend';
import CalendarOptionsModal from './Options/CalendarOptionsModal';
import styles from './CalendarPage.module.css';

const MINIMUM_DAY_WIDTH = 120;

function createCalendarSelector() {
  return createSelector(
    (state: AppState) => state.calendar.start,
    (state: AppState) => state.calendar.end,
    (state: AppState) => state.calendar.items,
    (start, end, movies) => ({ start, end, movies })
  );
}

function CalendarPage() {
  const dispatch = useDispatch();

  const { selectedFilterKey, filters } = useSelector(
    (state: AppState) => state.calendar
  );
  const { start, end, movies } = useSelector(createCalendarSelector());
  const queueDetails = useQueueDetails();

  const missingMovieIds = useMemo(() => {
    return movies.reduce<number[]>((acc, movie) => {
      const { inCinemas } = movie;

      if (
        !movie.movieFileId &&
        inCinemas &&
        moment(inCinemas).isAfter(start) &&
        moment(inCinemas).isBefore(end) &&
        isBefore(inCinemas) &&
        !queueDetails.some(
          (details) => !!details.movie && details.movie.id === movie.id
        )
      ) {
        acc.push(movie.id);
      }

      return acc;
    }, []);
  }, [start, end, movies, queueDetails]);
  const searchMissingCommandId = useSelector(
    (state: AppState) => state.calendar.searchMissingCommandId
  );
  const { commands } = useCommands();
  const isSearchingForMissing =
    searchMissingCommandId != null &&
    isCommandExecuting(
      commands.find((command) => command.id === searchMissingCommandId)
    );
  const isRssSyncExecuting = useCommandExecuting(commandNames.RSS_SYNC);
  const customFilters = useSelector(createCustomFiltersSelector('calendar'));
  const hasMovies = !!useMovieCount().count;

  const [pageContentRef, { width }] = useMeasure();
  const [isCalendarLinkModalOpen, setIsCalendarLinkModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const isMeasured = width > 0;
  const PageComponent = hasMovies ? Calendar : NoMovie;

  const handleGetCalendarLinkPress = useCallback(() => {
    setIsCalendarLinkModalOpen(true);
  }, []);

  const handleGetCalendarLinkModalClose = useCallback(() => {
    setIsCalendarLinkModalOpen(false);
  }, []);

  const handleOptionsPress = useCallback(() => {
    setIsOptionsModalOpen(true);
  }, []);

  const handleOptionsModalClose = useCallback(() => {
    setIsOptionsModalOpen(false);
  }, []);

  const handleRssSyncPress = useCallback(() => {
    executeCommand({
      name: commandNames.RSS_SYNC,
    });
  }, []);

  const handleSearchMissingPress = useCallback(() => {
    dispatch(searchMissing({ movieIds: missingMovieIds }));
  }, [missingMovieIds, dispatch]);

  const handleFilterSelect = useCallback(
    (key: string | number) => {
      dispatch(setCalendarFilter({ selectedFilterKey: key }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (width === 0) {
      return;
    }

    const dayCount = Math.max(
      3,
      Math.min(7, Math.floor(width / MINIMUM_DAY_WIDTH))
    );

    dispatch(setCalendarDaysCount({ dayCount }));
  }, [width, dispatch]);

  return (
    <PageContent title={translate('Calendar')}>
      <PageToolbar>
        <PageToolbarSection>
          <PageToolbarButton
            label={translate('ICalLink')}
            iconName={icons.CALENDAR}
            onPress={handleGetCalendarLinkPress}
          />

          <PageToolbarSeparator />

          <PageToolbarButton
            label={translate('RssSync')}
            iconName={icons.RSS}
            isSpinning={isRssSyncExecuting}
            onPress={handleRssSyncPress}
          />

          <PageToolbarButton
            label={translate('SearchForMissing')}
            iconName={icons.SEARCH}
            isDisabled={!missingMovieIds.length}
            isSpinning={isSearchingForMissing}
            onPress={handleSearchMissingPress}
          />
        </PageToolbarSection>

        <PageToolbarSection alignContent={align.RIGHT}>
          <PageToolbarButton
            label={translate('Options')}
            iconName={icons.POSTER}
            onPress={handleOptionsPress}
          />

          <FilterMenu
            alignMenu={align.RIGHT}
            isDisabled={!hasMovies}
            selectedFilterKey={selectedFilterKey}
            filters={filters}
            customFilters={customFilters}
            filterModalConnectorComponent={CalendarFilterModal}
            onFilterSelect={handleFilterSelect}
          />
        </PageToolbarSection>
      </PageToolbar>

      <PageContentBody
        ref={pageContentRef}
        className={styles.calendarPageBody}
        innerClassName={styles.calendarInnerPageBody}
      >
        {isMeasured ? <PageComponent totalItems={0} /> : <div />}
        {hasMovies && <Legend />}
      </PageContentBody>

      <CalendarLinkModal
        isOpen={isCalendarLinkModalOpen}
        onModalClose={handleGetCalendarLinkModalClose}
      />

      <CalendarOptionsModal
        isOpen={isOptionsModalOpen}
        onModalClose={handleOptionsModalClose}
      />
    </PageContent>
  );
}

export default CalendarPage;
