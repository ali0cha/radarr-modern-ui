import { handleThunks } from 'Store/thunks';
import createHandleActions from './Creators/createHandleActions';
import autoTaggings from './Settings/autoTaggings';
import autoTaggingSpecifications from './Settings/autoTaggingSpecifications';
import delayProfiles from './Settings/delayProfiles';
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
import releaseProfiles from './Settings/releaseProfiles';
import remotePathMappings from './Settings/remotePathMappings';
import ui from './Settings/ui';

export * from './Settings/autoTaggingSpecifications';
export * from './Settings/autoTaggings';
export * from './Settings/delayProfiles';
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
export * from './Settings/releaseProfiles';
export * from './Settings/remotePathMappings';
export * from './Settings/ui';

//
// Variables

export const section = 'settings';

//
// State

export const defaultState = {
  advancedSettings: false,
  autoTaggingSpecifications: autoTaggingSpecifications.defaultState,
  autoTaggings: autoTaggings.defaultState,
  delayProfiles: delayProfiles.defaultState,
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
  releaseProfiles: releaseProfiles.defaultState,
  remotePathMappings: remotePathMappings.defaultState,
  ui: ui.defaultState
};

export const persistState = [
  'settings.importListExclusions.pageSize'
];

//
// Action Handlers

export const actionHandlers = handleThunks({
  ...autoTaggingSpecifications.actionHandlers,
  ...autoTaggings.actionHandlers,
  ...delayProfiles.actionHandlers,
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
  ...releaseProfiles.actionHandlers,
  ...remotePathMappings.actionHandlers,
  ...ui.actionHandlers
});

//
// Reducers

export const reducers = createHandleActions({

  ...autoTaggingSpecifications.reducers,
  ...autoTaggings.reducers,
  ...delayProfiles.reducers,
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
  ...releaseProfiles.reducers,
  ...remotePathMappings.reducers,
  ...ui.reducers

}, defaultState, section);
