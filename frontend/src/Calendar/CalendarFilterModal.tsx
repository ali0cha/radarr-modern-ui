import React, { useCallback } from 'react';
import FilterModal from 'Components/Filter/FilterModal';
import {
  calendarFilterBuilderProps,
  useCalendar,
  useCalendarStore,
} from './useCalendar';

interface CalendarFilterModalProps {
  isOpen: boolean;
}

export default function CalendarFilterModal(props: CalendarFilterModalProps) {
  const { items: sectionItems } = useCalendar();
  const setFilter = useCalendarStore((state) => state.setFilter);

  const dispatchSetFilter = useCallback(
    ({ selectedFilterKey }: { selectedFilterKey: string | number }) => {
      setFilter(selectedFilterKey);
    },
    [setFilter]
  );

  return (
    <FilterModal
      // TODO: Don't spread all the props
      {...props}
      sectionItems={sectionItems}
      filterBuilderProps={calendarFilterBuilderProps}
      customFilterType="calendar"
      dispatchSetFilter={dispatchSetFilter}
    />
  );
}
