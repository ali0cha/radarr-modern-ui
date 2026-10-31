import { handleThunks } from 'Store/thunks';
import createHandleActions from './Creators/createHandleActions';
import importListExclusions from './Settings/importListExclusions';
import remotePathMappings from './Settings/remotePathMappings';

export * from './Settings/importListExclusions';
export * from './Settings/remotePathMappings';

//
// Variables

export const section = 'settings';

//
// State

export const defaultState = {
  advancedSettings: false,
  importListExclusions: importListExclusions.defaultState,
  remotePathMappings: remotePathMappings.defaultState
};

export const persistState = [
  'settings.importListExclusions.pageSize'
];

//
// Action Handlers

export const actionHandlers = handleThunks({
  ...importListExclusions.actionHandlers,
  ...remotePathMappings.actionHandlers
});

//
// Reducers

export const reducers = createHandleActions({

  ...importListExclusions.reducers,
  ...remotePathMappings.reducers

}, defaultState, section);
