import { handleThunks } from 'Store/thunks';
import createHandleActions from './Creators/createHandleActions';
import general from './Settings/general';
import importListExclusions from './Settings/importListExclusions';
import indexerFlags from './Settings/indexerFlags';
import languages from './Settings/languages';
import mediaManagement from './Settings/mediaManagement';
import metadata from './Settings/metadata';
import metadataOptions from './Settings/metadataOptions';
import naming from './Settings/naming';
import namingExamples from './Settings/namingExamples';
import qualityDefinitions from './Settings/qualityDefinitions';
import qualityProfiles from './Settings/qualityProfiles';
import remotePathMappings from './Settings/remotePathMappings';
import ui from './Settings/ui';

export * from './Settings/general';
export * from './Settings/importListExclusions';
export * from './Settings/indexerFlags';
export * from './Settings/languages';
export * from './Settings/mediaManagement';
export * from './Settings/metadata';
export * from './Settings/metadataOptions';
export * from './Settings/naming';
export * from './Settings/namingExamples';
export * from './Settings/qualityDefinitions';
export * from './Settings/qualityProfiles';
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
  indexerFlags: indexerFlags.defaultState,
  languages: languages.defaultState,
  mediaManagement: mediaManagement.defaultState,
  metadata: metadata.defaultState,
  metadataOptions: metadataOptions.defaultState,
  naming: naming.defaultState,
  namingExamples: namingExamples.defaultState,
  qualityDefinitions: qualityDefinitions.defaultState,
  qualityProfiles: qualityProfiles.defaultState,
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
  ...indexerFlags.actionHandlers,
  ...languages.actionHandlers,
  ...mediaManagement.actionHandlers,
  ...metadata.actionHandlers,
  ...metadataOptions.actionHandlers,
  ...naming.actionHandlers,
  ...namingExamples.actionHandlers,
  ...qualityDefinitions.actionHandlers,
  ...qualityProfiles.actionHandlers,
  ...remotePathMappings.actionHandlers,
  ...ui.actionHandlers
});

//
// Reducers

export const reducers = createHandleActions({

  ...general.reducers,
  ...importListExclusions.reducers,
  ...indexerFlags.reducers,
  ...languages.reducers,
  ...mediaManagement.reducers,
  ...metadata.reducers,
  ...metadataOptions.reducers,
  ...naming.reducers,
  ...namingExamples.reducers,
  ...qualityDefinitions.reducers,
  ...qualityProfiles.reducers,
  ...remotePathMappings.reducers,
  ...ui.reducers

}, defaultState, section);
