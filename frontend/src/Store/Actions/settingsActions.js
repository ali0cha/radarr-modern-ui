import { handleThunks } from 'Store/thunks';
import createHandleActions from './Creators/createHandleActions';
import general from './Settings/general';
import importListExclusions from './Settings/importListExclusions';
import mediaManagement from './Settings/mediaManagement';
import metadata from './Settings/metadata';
import metadataOptions from './Settings/metadataOptions';
import naming from './Settings/naming';
import namingExamples from './Settings/namingExamples';
import remotePathMappings from './Settings/remotePathMappings';
import ui from './Settings/ui';

export * from './Settings/general';
export * from './Settings/importListExclusions';
export * from './Settings/mediaManagement';
export * from './Settings/metadata';
export * from './Settings/metadataOptions';
export * from './Settings/naming';
export * from './Settings/namingExamples';
export * from './Settings/remotePathMappings';
export * from './Settings/ui';

//
// Variables

export const section = 'settings';

//
// State

export const defaultState = {
  advancedSettings: false,
  general: general.defaultState,
  importListExclusions: importListExclusions.defaultState,
  mediaManagement: mediaManagement.defaultState,
  metadata: metadata.defaultState,
  metadataOptions: metadataOptions.defaultState,
  naming: naming.defaultState,
  namingExamples: namingExamples.defaultState,
  remotePathMappings: remotePathMappings.defaultState,
  ui: ui.defaultState
};

export const persistState = [
  'settings.importListExclusions.pageSize'
];

//
// Action Handlers

export const actionHandlers = handleThunks({
  ...general.actionHandlers,
  ...importListExclusions.actionHandlers,
  ...mediaManagement.actionHandlers,
  ...metadata.actionHandlers,
  ...metadataOptions.actionHandlers,
  ...naming.actionHandlers,
  ...namingExamples.actionHandlers,
  ...remotePathMappings.actionHandlers,
  ...ui.actionHandlers
});

//
// Reducers

export const reducers = createHandleActions({

  ...general.reducers,
  ...importListExclusions.reducers,
  ...mediaManagement.reducers,
  ...metadata.reducers,
  ...metadataOptions.reducers,
  ...naming.reducers,
  ...namingExamples.reducers,
  ...remotePathMappings.reducers,
  ...ui.reducers

}, defaultState, section);
