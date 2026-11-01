import { cloneDeep } from 'lodash';
import { create } from 'zustand';
import { queryClient } from 'App/queryClient';
import { ApiError, fetchApi, getApiPath } from 'Helpers/Hooks/useApiQuery';
import Movie, { MovieAvailability, MovieMonitor } from 'Movie/Movie';
import { setMovie } from 'Movie/useMovies';
import { invalidateRootFolders } from 'RootFolder/useRootFolders';
import getNewMovie from 'Utilities/Movie/getNewMovie';

const LOOKUP_PATH = '/movie/lookup';
const IMPORT_PATH = '/movie/import';

// A folder of the root folder that is looked up, and what is chosen for it
export interface ImportMovieItem {
  id: string;
  term?: string;
  path?: string;
  relativePath?: string;
  isFetching?: boolean;
  isPopulated?: boolean;
  isQueued?: boolean;
  error?: ApiError | null;
  items?: Movie[];
  selectedMovie?: Movie;
  monitor?: MovieMonitor;
  qualityProfileId?: number;
  minimumAvailability?: MovieAvailability;
}

interface ImportMovieState {
  items: ImportMovieItem[];
  isLookingUpMovie: boolean;
  isImporting: boolean;
  importError: ApiError | null;
}

const defaultState: ImportMovieState = {
  items: [],
  isLookingUpMovie: false,
  isImporting: false,
  importError: null,
};

// Nothing of the import is kept once the page is left
export const useImportMovieStore = create<ImportMovieState>()(
  () => defaultState
);

const { setState, getState } = useImportMovieStore;

// The folders are looked up one by one, in the order that they were queued
const queue: string[] = [];
let concurrentLookups = 0;
let abortController: AbortController | null = null;

function updateItem(
  id: string,
  changes: Partial<ImportMovieItem>,
  { updateOnly = false } = {}
) {
  setState((state) => {
    const index = state.items.findIndex((item) => item.id === id);

    if (index < 0) {
      return updateOnly
        ? state
        : { items: [...state.items, { id, ...changes }] };
    }

    const items = [...state.items];

    items[index] = { ...items[index], ...changes };

    return { items };
  });
}

// What the user chose for a folder, such as the movie or the quality profile
export function setImportMovieValue({
  id,
  ...values
}: { id: string } & Partial<ImportMovieItem>) {
  updateItem(id, values);
}

function startLookupMovie(start = false) {
  if (concurrentLookups >= 1) {
    return;
  }

  const { isLookingUpMovie, items } = getState();
  const queueId = queue[0];

  if (start && !isLookingUpMovie) {
    setState({ isLookingUpMovie: true });
  } else if (!isLookingUpMovie) {
    return;
  } else if (!queueId) {
    setState({ isLookingUpMovie: false });
    return;
  }

  const queued = items.find((item) => item.id === queueId);

  queue.splice(0, 1);

  // The folder is not there anymore, go on with the next one
  if (!queued) {
    startLookupMovie();
    return;
  }

  concurrentLookups++;

  updateItem(queued.id, { isFetching: true });

  const controller = new AbortController();

  abortController = controller;

  fetchApi<Movie[]>(
    getApiPath(`${LOOKUP_PATH}?term=${encodeURIComponent(queued.term ?? '')}`),
    {
      headers: { 'X-Api-Key': window.Radarr.apiKey },
      signal: controller.signal,
    }
  )
    .then(
      (data) => {
        updateItem(
          queued.id,
          {
            isFetching: false,
            isPopulated: true,
            error: null,
            items: data,
            isQueued: false,
            selectedMovie: queued.selectedMovie ?? data[0],
          },
          { updateOnly: true }
        );
      },
      (error: ApiError) => {
        updateItem(
          queued.id,
          {
            isFetching: false,
            isPopulated: false,
            error: controller.signal.aborted ? null : error,
            isQueued: false,
          },
          { updateOnly: true }
        );
      }
    )
    .finally(() => {
      concurrentLookups--;

      startLookupMovie();
    });
}

interface QueueLookupPayload {
  name: string;
  path?: string;
  relativePath?: string;
  term: string;
  topOfQueue?: boolean;
}

export function queueLookupMovie({
  name,
  path,
  relativePath,
  term,
  topOfQueue = false,
}: QueueLookupPayload) {
  const item = getState().items.find(({ id }) => id === name) ?? {
    id: name,
    path,
    relativePath,
    isFetching: false,
    isPopulated: false,
    error: null,
  };

  updateItem(name, {
    ...item,
    term,
    isQueued: true,
    items: [],
  });

  const itemIndex = queue.indexOf(name);

  if (itemIndex >= 0) {
    queue.splice(itemIndex, 1);
  }

  if (topOfQueue) {
    queue.unshift(name);
  } else {
    queue.push(name);
  }

  if (term && term.length > 2) {
    startLookupMovie(true);
  }
}

// Looks up the folders that were not, for instance when they were too short
// to be searched for
export function lookupUnsearchedMovies() {
  const { isLookingUpMovie, items } = getState();

  if (isLookingUpMovie) {
    return;
  }

  items.forEach(({ id, isPopulated }) => {
    if (!isPopulated && !queue.includes(id)) {
      queue.push(id);
    }
  });

  if (queue.length) {
    startLookupMovie(true);
  }
}

export function cancelLookupMovie() {
  queue.splice(0, queue.length);

  setState((state) => ({
    isLookingUpMovie: false,
    items: state.items.map((item) =>
      item.isQueued ? { ...item, isQueued: false } : item
    ),
  }));
}

export function clearImportMovie() {
  abortController?.abort();
  abortController = null;

  queue.splice(0, queue.length);

  setState(defaultState);
}

// Imports the folders that have a movie chosen
export function importMovies({ ids }: { ids: string[] }) {
  setState({ isImporting: true });

  const { items } = getState();
  const addedIds: string[] = [];

  const allNewMovies = ids.reduce<Movie[]>((acc, id) => {
    const item = items.find((i) => i.id === id);
    const selectedMovie = item?.selectedMovie;

    // Make sure we have a selected movie and the same movie hasn't been added
    // yet.
    if (
      item &&
      selectedMovie &&
      !acc.some(({ tmdbId }) => tmdbId === selectedMovie.tmdbId)
    ) {
      const newMovie = getNewMovie(
        cloneDeep(selectedMovie),
        item as unknown as Parameters<typeof getNewMovie>[1]
      );

      newMovie.path = item.path as string;

      addedIds.push(id);
      acc.push(newMovie);
    }

    return acc;
  }, []);

  return fetchApi<Movie[]>(getApiPath(IMPORT_PATH), {
    method: 'POST',
    headers: {
      'X-Api-Key': window.Radarr.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(allNewMovies),
  }).then(
    (movies) => {
      movies.forEach((movie) => setMovie(queryClient, movie));

      setState((state) => ({
        isImporting: false,
        importError: null,
        items: state.items.filter(({ id }) => !addedIds.includes(id)),
      }));

      invalidateRootFolders(queryClient);
    },
    (error: ApiError) => {
      setState({ isImporting: false, importError: error });
    }
  );
}

export const useImportMovieItems = () =>
  useImportMovieStore((state) => state.items);

export const useImportMovieItem = (id: string) =>
  useImportMovieStore((state) => state.items.find((item) => item.id === id));
