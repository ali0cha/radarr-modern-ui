import { get } from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import { useCustomFilters } from 'Components/Filter/useCustomFilters';
import Column from 'Components/Table/Column';
import { mergeColumns } from 'Components/Table/pagedTable';
import { createPersist } from 'Helpers/createPersist';
import {
  ASCENDING,
  DESCENDING,
  SortDirection,
} from 'Helpers/Props/sortDirections';
import Movie from 'Movie/Movie';
import { filterPredicates, filters } from 'Movie/movieDefinitions';
import { useMovies } from 'Movie/useMovies';
import {
  filterItems,
  sortItems,
} from 'Store/Selectors/createClientSideCollectionSelector';
import hasDifferentItemsOrOrder from 'Utilities/Object/hasDifferentItemsOrOrder';
import {
  columns as definedColumns,
  filterBuilderProps,
  sortPredicates,
} from './movieIndexDefinitions';

export { filterBuilderProps, filters };

type FilterKey = string | number;

export interface PosterOptions {
  detailedProgressBar: boolean;
  size: string;
  showTitle: boolean;
  showMonitored: boolean;
  showQualityProfile: boolean;
  showCinemaRelease: boolean;
  showDigitalRelease: boolean;
  showPhysicalRelease: boolean;
  showReleaseDate: boolean;
  showTmdbRating: boolean;
  showImdbRating: boolean;
  showRottenTomatoesRating: boolean;
  showTraktRating: boolean;
  showTags: boolean;
  showSearchAction: boolean;
}

export interface OverviewOptions {
  detailedProgressBar: boolean;
  size: string;
  showMonitored: boolean;
  showStudio: boolean;
  showQualityProfile: boolean;
  showAdded: boolean;
  showPath: boolean;
  showSizeOnDisk: boolean;
  showTags: boolean;
  showSearchAction: boolean;
}

export interface TableOptions {
  showSearchAction: boolean;
}

interface StoredColumn {
  name: string;
  isVisible: boolean;
}

interface MovieIndexState {
  sortKey: string;
  sortDirection: SortDirection;
  secondarySortKey: string;
  secondarySortDirection: SortDirection;
  view: string;
  selectedFilterKey: FilterKey;
  columns: StoredColumn[];
  posterOptions: PosterOptions;
  overviewOptions: OverviewOptions;
  tableOptions: TableOptions;
}

interface MovieIndexActions {
  setSort: (sortKey: string, sortDirection?: SortDirection) => void;
  setFilter: (selectedFilterKey: FilterKey) => void;
  setView: (view: string) => void;
  setTableOptions: (options: {
    columns?: Column[];
    tableOptions?: TableOptions;
  }) => void;
  setPosterOptions: (options: Partial<PosterOptions>) => void;
  setOverviewOptions: (options: Partial<OverviewOptions>) => void;
}

const PERSISTED_KEYS = [
  'sortKey',
  'sortDirection',
  'selectedFilterKey',
  'view',
  'columns',
  'posterOptions',
  'overviewOptions',
  'tableOptions',
] as const;

const defaultState: MovieIndexState = {
  sortKey: 'sortTitle',
  sortDirection: ASCENDING,
  secondarySortKey: 'sortTitle',
  secondarySortDirection: ASCENDING,
  view: 'posters',
  selectedFilterKey: 'all',
  columns: (definedColumns as Column[]).map(({ name, isVisible }) => ({
    name,
    isVisible,
  })),

  posterOptions: {
    detailedProgressBar: true,
    size: 'large',
    showTitle: false,
    showMonitored: true,
    showQualityProfile: true,
    showCinemaRelease: false,
    showDigitalRelease: false,
    showPhysicalRelease: false,
    showReleaseDate: false,
    showTmdbRating: false,
    showImdbRating: false,
    showRottenTomatoesRating: false,
    showTraktRating: false,
    showTags: false,
    showSearchAction: false,
  },

  overviewOptions: {
    detailedProgressBar: true,
    size: 'medium',
    showMonitored: true,
    showStudio: true,
    showQualityProfile: true,
    showAdded: false,
    showPath: false,
    showSizeOnDisk: false,
    showTags: false,
    showSearchAction: false,
  },

  tableOptions: {
    showSearchAction: false,
  },
};

// The preferences of the index are saved like they were in the Redux section of
// the same name.
export const useMovieIndexStore = createPersist<
  MovieIndexState & MovieIndexActions
>(
  'movie_index',
  (set) => ({
    ...defaultState,

    setSort: (sortKey, sortDirection) =>
      set((state) => {
        if (sortDirection) {
          return { sortKey, sortDirection };
        }

        // The same column again reverses the order
        if (sortKey === state.sortKey) {
          return {
            sortKey,
            sortDirection:
              state.sortDirection === ASCENDING ? DESCENDING : ASCENDING,
          };
        }

        return { sortKey, sortDirection: state.sortDirection };
      }),
    setFilter: (selectedFilterKey) => set({ selectedFilterKey }),
    setView: (view) => set({ view }),
    setTableOptions: ({ columns, tableOptions }) =>
      set({
        ...(columns
          ? {
              columns: columns.map(({ name, isVisible }) => ({
                name,
                isVisible,
              })),
            }
          : {}),
        ...(tableOptions ? { tableOptions } : {}),
      }),
    setPosterOptions: (options) =>
      set((state) => ({
        posterOptions: { ...state.posterOptions, ...options },
      })),
    setOverviewOptions: (options) =>
      set((state) => ({
        overviewOptions: { ...state.overviewOptions, ...options },
      })),
  }),
  {
    partialize: (state) =>
      Object.fromEntries(
        PERSISTED_KEYS.map((key) => [key, state[key]])
      ) as unknown as MovieIndexState & MovieIndexActions,
    // The options saved by older versions may lack the newest ones
    merge: (persisted, current) => {
      const saved = (persisted ?? {}) as Partial<MovieIndexState>;

      return {
        ...current,
        ...saved,
        posterOptions: { ...current.posterOptions, ...saved.posterOptions },
        overviewOptions: {
          ...current.overviewOptions,
          ...saved.overviewOptions,
        },
        tableOptions: { ...current.tableOptions, ...saved.tableOptions },
      };
    },
    migrateFromLegacy: (legacyState) => {
      const legacy = get(legacyState, 'movieIndex') as
        | Record<string, unknown>
        | undefined;

      if (!legacy) {
        return undefined;
      }

      const migrated: Record<string, unknown> = {};

      PERSISTED_KEYS.forEach((key) => {
        if (legacy[key] !== undefined) {
          migrated[key] =
            key === 'columns'
              ? (legacy.columns as Column[]).map(({ name, isVisible }) => ({
                  name,
                  isVisible,
                }))
              : legacy[key];
        }
      });

      return migrated as Partial<MovieIndexState & MovieIndexActions>;
    },
  }
);

export function useMovieIndexColumns() {
  const storedColumns = useMovieIndexStore((state) => state.columns);

  return useMemo(
    () => mergeColumns(definedColumns as Column[], storedColumns),
    [storedColumns]
  );
}

export const usePosterOptions = () =>
  useMovieIndexStore((state) => state.posterOptions);

export const useOverviewOptions = () =>
  useMovieIndexStore((state) => state.overviewOptions);

export const useTableOptions = () =>
  useMovieIndexStore((state) => state.tableOptions);

// What the index shows: the movies that pass the filter, in the order that was
// chosen. The movies are only listed by id: the views get their data
// themselves, so they are not rendered again when a movie changes.
export function useMovieIndex() {
  const { movies, isFetching, isPopulated, error } = useMovies();

  const sortKey = useMovieIndexStore((state) => state.sortKey);
  const sortDirection = useMovieIndexStore((state) => state.sortDirection);
  const secondarySortKey = useMovieIndexStore(
    (state) => state.secondarySortKey
  );
  const secondarySortDirection = useMovieIndexStore(
    (state) => state.secondarySortDirection
  );
  const selectedFilterKey = useMovieIndexStore(
    (state) => state.selectedFilterKey
  );
  const view = useMovieIndexStore((state) => state.view);
  const columns = useMovieIndexColumns();

  const { customFilters: allCustomFilters } = useCustomFilters();

  const customFilters = useMemo(
    () => allCustomFilters.filter(({ type }) => type === 'movieIndex'),
    [allCustomFilters]
  );

  const filteredMovies: Movie[] = useMemo(() => {
    const filtered = filterItems(movies, {
      selectedFilterKey,
      filters,
      customFilters,
      filterPredicates,
    }) as Movie[];

    return sortItems(filtered, {
      sortKey,
      sortDirection,
      sortPredicates,
      secondarySortKey,
      secondarySortDirection,
    }) as Movie[];
  }, [
    movies,
    selectedFilterKey,
    customFilters,
    sortKey,
    sortDirection,
    secondarySortKey,
    secondarySortDirection,
  ]);

  const itemsRef = useRef<Movie[]>([]);

  const items = useMemo(() => {
    const trimmed = filteredMovies.map(({ id, sortTitle }) => ({
      id,
      sortTitle,
    })) as unknown as Movie[];

    if (hasDifferentItemsOrOrder(itemsRef.current, trimmed)) {
      itemsRef.current = trimmed;
    }

    return itemsRef.current;
  }, [filteredMovies]);

  const handleSortSelect = useCallback((key: string) => {
    useMovieIndexStore.getState().setSort(key);
  }, []);

  return {
    isFetching,
    isPopulated,
    error,
    totalItems: movies.length,
    items,
    filteredMovies,
    columns,
    selectedFilterKey,
    filters,
    filterBuilderProps,
    customFilters,
    sortKey,
    sortDirection,
    view,
    handleSortSelect,
  };
}
