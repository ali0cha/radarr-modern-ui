import { createPagedTable } from 'Components/Table/pagedTable';
import usePagedTable from 'Components/Table/usePagedTable';
import { filterTypes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

export const LOGS_PATH = '/log';

export interface LogEvent {
  id: number;
  time: string;
  level: string;
  logger: string;
  message: string;
  exception?: string;
  exceptionType?: string;
}

export const logsTable = createPagedTable('system.logs', {
  pageSize: 50,
  sortKey: 'time',
  sortDirection: 'descending',
  selectedFilterKey: 'all',

  columns: [
    {
      name: 'level',
      columnLabel: () => translate('Level'),
      label: '',
      isSortable: false,
      isVisible: true,
      isModifiable: false,
    },
    {
      name: 'time',
      label: () => translate('Time'),
      isSortable: true,
      isVisible: true,
      isModifiable: false,
    },
    {
      name: 'logger',
      label: () => translate('Component'),
      isSortable: false,
      isVisible: true,
      isModifiable: false,
    },
    {
      name: 'message',
      label: () => translate('Message'),
      isVisible: true,
      isModifiable: false,
    },
    {
      name: 'actions',
      columnLabel: () => translate('Actions'),
      label: '',
      isVisible: true,
      isModifiable: false,
    },
  ],

  filters: [
    {
      key: 'all',
      label: () => translate('All'),
      filters: [],
    },
    {
      key: 'info',
      label: () => translate('Info'),
      filters: [{ key: 'level', value: 'info', type: filterTypes.EQUAL }],
    },
    {
      key: 'warn',
      label: () => translate('Warn'),
      filters: [{ key: 'level', value: 'warn', type: filterTypes.EQUAL }],
    },
    {
      key: 'error',
      label: () => translate('Error'),
      filters: [{ key: 'level', value: 'error', type: filterTypes.EQUAL }],
    },
  ],

  filterBuilderProps: [],
});

export function useLogs() {
  return usePagedTable<LogEvent>({ table: logsTable, path: LOGS_PATH });
}
