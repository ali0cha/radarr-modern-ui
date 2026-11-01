import { get } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { Error } from 'App/State/AppSectionState';
import { createPersist } from 'Helpers/createPersist';
import useApiQuery, { fetchApi, getApiPath } from 'Helpers/Hooks/useApiQuery';
import {
  ASCENDING,
  DESCENDING,
  SortDirection,
} from 'Helpers/Props/sortDirections';
import { sortItems } from 'Store/Selectors/createClientSideCollectionSelector';
import sortByProp from 'Utilities/Array/sortByProp';
import naturalExpansion from 'Utilities/String/naturalExpansion';
import ImportMode from './ImportMode';
import InteractiveImport from './InteractiveImport';

export const MANUAL_IMPORT_PATH = '/manualimport';

const MAXIMUM_RECENT_FOLDERS = 10;

interface FavoriteFolder {
  folder: string;
}

interface RecentFolder {
  folder: string;
  lastUsed: string;
}

interface InteractiveImportPreferencesState {
  sortKey: string;
  sortDirection: SortDirection;
  favoriteFolders: FavoriteFolder[];
  recentFolders: RecentFolder[];
  importMode: ImportMode;
}

// The sort, the folders and the import mode are remembered, like they were in
// the Redux section of the same name.
export const useInteractiveImportPreferences =
  createPersist<InteractiveImportPreferencesState>(
    'interactive_import',
    () => ({
      sortKey: 'relativePath',
      sortDirection: ASCENDING,
      favoriteFolders: [],
      recentFolders: [],
      importMode: 'chooseImportMode',
    }),
    {
      migrateFromLegacy: (legacyState) => {
        const legacy = get(legacyState, 'interactiveImport') as
          | Partial<InteractiveImportPreferencesState>
          | undefined;

        if (!legacy) {
          return undefined;
        }

        const {
          sortKey,
          sortDirection,
          favoriteFolders,
          recentFolders,
          importMode,
        } = legacy;

        return {
          ...(sortKey ? { sortKey } : {}),
          ...(sortDirection ? { sortDirection } : {}),
          ...(favoriteFolders ? { favoriteFolders } : {}),
          ...(recentFolders ? { recentFolders } : {}),
          ...(importMode ? { importMode } : {}),
        };
      },
    }
  );

type ItemChanges = Partial<InteractiveImport> & { isReprocessing?: boolean };

interface EditsStore {
  // What was changed to the files that were found, by id
  edits: Record<number, ItemChanges>;
  update: (ids: number[], changes: ItemChanges) => void;
  clear: () => void;
}

const useEdits = create<EditsStore>((set) => ({
  edits: {},
  update: (ids, changes) =>
    set((state) => {
      const edits = { ...state.edits };

      ids.forEach((id) => {
        edits[id] = { ...edits[id], ...changes };
      });

      return { edits };
    }),
  clear: () => set({ edits: {} }),
}));

const sortPredicates = {
  relativePath: (item: InteractiveImport) =>
    naturalExpansion(item.relativePath.toLowerCase()),
  movie: (item: InteractiveImport) => (item.movie ? item.movie.sortTitle : ''),
  quality: (item: InteractiveImport) => item.qualityWeight || 0,
  customFormats: (item: InteractiveImport) =>
    (item as unknown as { customFormatScore: number }).customFormatScore,
};

const NO_ITEMS: InteractiveImport[] = [];

interface InteractiveImportOptions {
  downloadId?: string;
  movieId?: number;
  folder?: string;
  filterExistingFiles?: boolean;
}

// The files that can be imported, as found by the server, with what was changed
// to them. Nothing is kept when the files are not shown any more.
export function useInteractiveImport({
  downloadId,
  movieId,
  folder,
  filterExistingFiles,
}: InteractiveImportOptions) {
  const params = new URLSearchParams();

  if (downloadId) {
    params.set('downloadId', downloadId);
  }

  if (movieId) {
    params.set('movieId', String(movieId));
  }

  if (folder) {
    params.set('folder', folder);
  }

  if (filterExistingFiles !== undefined) {
    params.set('filterExistingFiles', String(filterExistingFiles));
  }

  const path = `${MANUAL_IMPORT_PATH}?${params.toString()}`;
  const hasSource = !!downloadId || !!folder;

  const { data, isFetching, isSuccess, error } = useApiQuery<
    InteractiveImport[]
  >({
    path,
    queryOptions: {
      enabled: hasSource,
      retry: false,
      gcTime: 0,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  });

  const edits = useEdits((state) => state.edits);
  const sortKey = useInteractiveImportPreferences((state) => state.sortKey);
  const sortDirection = useInteractiveImportPreferences(
    (state) => state.sortDirection
  );

  // New files were found: what was changed to the previous ones is dropped
  useEffect(() => {
    useEdits.getState().clear();

    return () => {
      useEdits.getState().clear();
    };
  }, [path]);

  const originalItems = data ?? NO_ITEMS;

  useEffect(() => {
    latestOriginalItems = originalItems;
  }, [originalItems]);

  const items = useMemo(() => {
    const merged = originalItems.map((item) => ({
      ...item,
      ...edits[item.id],
    }));

    return sortItems(merged, {
      sortKey,
      sortDirection,
      sortPredicates,
    }) as InteractiveImport[];
  }, [originalItems, edits, sortKey, sortDirection]);

  return {
    isFetching,
    isPopulated: isSuccess,
    error: hasSource
      ? error
      : ({
          responseJSON: { message: '`downloadId` or `folder` is required.' },
        } as unknown as Error),
    items,
    originalItems,
    sortKey,
    sortDirection,
  };
}

export function updateInteractiveImportItem({
  id,
  ...changes
}: ItemChanges & { id: number }) {
  useEdits.getState().update([id], changes);
}

export function updateInteractiveImportItems({
  ids,
  ...changes
}: ItemChanges & { ids: number[] }) {
  useEdits.getState().update(ids, changes);
}

export function setInteractiveImportSort({
  sortKey,
  sortDirection,
}: {
  sortKey: string;
  sortDirection?: SortDirection;
}) {
  useInteractiveImportPreferences.setState((state) => {
    if (sortDirection) {
      return { sortKey, sortDirection };
    }

    if (sortKey === state.sortKey) {
      return {
        sortKey,
        sortDirection:
          state.sortDirection === ASCENDING ? DESCENDING : ASCENDING,
      };
    }

    return { sortKey, sortDirection: state.sortDirection };
  });
}

export function setInteractiveImportMode({
  importMode,
}: {
  importMode: ImportMode;
}) {
  useInteractiveImportPreferences.setState({ importMode });
}

export function addRecentFolder({ folder }: { folder: string }) {
  useInteractiveImportPreferences.setState((state) => {
    const recentFolders = state.recentFolders.filter(
      (recent) => recent.folder !== folder
    );

    recentFolders.push({ folder, lastUsed: moment().toISOString() });

    return {
      recentFolders: recentFolders.slice(
        Math.max(recentFolders.length - MAXIMUM_RECENT_FOLDERS, 0)
      ),
    };
  });
}

export function removeRecentFolder({ folder }: { folder: string }) {
  useInteractiveImportPreferences.setState((state) => ({
    recentFolders: state.recentFolders.filter(
      (recent) => recent.folder !== folder
    ),
  }));
}

export function addFavoriteFolder({ folder }: { folder: string }) {
  useInteractiveImportPreferences.setState((state) => ({
    favoriteFolders: [...state.favoriteFolders, { folder }].sort(
      sortByProp('folder')
    ),
  }));
}

export function removeFavoriteFolder({ folder }: { folder: string }) {
  useInteractiveImportPreferences.setState((state) => ({
    favoriteFolders: state.favoriteFolders.filter(
      (favorite) => favorite.folder !== folder
    ),
  }));
}

let abortCurrentRequest: AbortController | null = null;
let currentIds: number[] = [];

// The files that the server found, to ask it again with what was changed
let latestOriginalItems: InteractiveImport[] = NO_ITEMS;

// Asks the server what the files are now, with what was changed to them. Only
// the last request counts.
export function reprocessInteractiveImportItems({ ids }: { ids: number[] }) {
  abortCurrentRequest?.abort();

  const { update, edits } = useEdits.getState();

  update(currentIds, { isReprocessing: false });
  update(ids, { isReprocessing: true });

  const body = ids.map((id) => {
    const item = {
      ...latestOriginalItems.find((i) => i.id === id),
      ...edits[id],
    } as InteractiveImport;

    return {
      id,
      path: item.path,
      movieId: item.movie ? item.movie.id : undefined,
      quality: item.quality,
      languages: item.languages,
      releaseGroup: item.releaseGroup,
      indexerFlags: item.indexerFlags,
      downloadId: (item as unknown as { downloadId?: string }).downloadId,
    };
  });

  const controller = new AbortController();

  abortCurrentRequest = controller;
  currentIds = ids;

  return fetchApi<InteractiveImport[]>(getApiPath(MANUAL_IMPORT_PATH), {
    method: 'POST',
    headers: {
      'X-Api-Key': window.Radarr.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: controller.signal,
  }).then(
    (data) => {
      data.forEach(({ id, ...item }) =>
        update([id], { ...item, isReprocessing: false })
      );
    },
    () => {
      if (!controller.signal.aborted) {
        update(ids, { isReprocessing: false });
      }
    }
  );
}
