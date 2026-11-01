import usePagedTable from 'Components/Table/usePagedTable';
import Movie from 'Movie/Movie';
import translate from 'Utilities/String/translate';
import {
  createWantedTable,
  useToggleMonitoredMovies,
  WANTED_POPULATE_REASONS,
} from '../wantedTable';

export const CUTOFF_UNMET_PATH = '/wanted/cutoff';

export const cutoffUnmetTable = createWantedTable('wanted.cutoffUnmet', [
  {
    name: 'languages',
    label: () => translate('Languages'),
    isVisible: false,
  },
]);

export function useCutoffUnmet() {
  return usePagedTable<Movie>({
    table: cutoffUnmetTable,
    path: CUTOFF_UNMET_PATH,
    populateReasons: WANTED_POPULATE_REASONS,
  });
}

export function useToggleMonitoredCutoffUnmetMovies() {
  return useToggleMonitoredMovies(CUTOFF_UNMET_PATH);
}
