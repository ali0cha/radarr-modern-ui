import usePagedTable from 'Components/Table/usePagedTable';
import Movie from 'Movie/Movie';
import {
  createWantedTable,
  useToggleMonitoredMovies,
  WANTED_POPULATE_REASONS,
} from '../wantedTable';

export const MISSING_PATH = '/wanted/missing';

export const missingTable = createWantedTable('wanted.missing');

export function useMissing() {
  return usePagedTable<Movie>({
    table: missingTable,
    path: MISSING_PATH,
    populateReasons: WANTED_POPULATE_REASONS,
  });
}

export function useToggleMonitoredMissingMovies() {
  return useToggleMonitoredMovies(MISSING_PATH);
}
