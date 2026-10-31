import { orderBy } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { SortDirection } from 'Helpers/Props/sortDirections';

interface ClientSideSortOptions<T> {
  sortKey: string;
  sortDirection: SortDirection;
  // How to get the value to sort by, for the keys that are not a property
  predicates?: Record<string, (item: T) => unknown>;
}

// Sorts a list in the browser. Pressing the key that is already used reverses
// the order, pressing another key keeps the current order.
export function useClientSideSort<T>(
  items: ReadonlyArray<T>,
  {
    sortKey: defaultSortKey,
    sortDirection: defaultSortDirection,
    predicates,
  }: ClientSideSortOptions<T>
) {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const onSortPress = useCallback(
    (key: string) => {
      if (key === sortKey) {
        setSortDirection((direction) =>
          direction === 'ascending' ? 'descending' : 'ascending'
        );
      } else {
        setSortKey(key);
      }
    },
    [sortKey]
  );

  const sortedItems = useMemo(() => {
    const predicate = predicates?.[sortKey];

    return orderBy(
      items,
      predicate ?? ((item) => (item as Record<string, unknown>)[sortKey]),
      sortDirection === 'ascending' ? 'asc' : 'desc'
    );
  }, [items, sortKey, sortDirection, predicates]);

  return { items: sortedItems, sortKey, sortDirection, onSortPress };
}
