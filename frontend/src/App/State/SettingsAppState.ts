import AppSectionState, {
  AppSectionDeleteState,
  AppSectionItemSchemaState,
  AppSectionItemState,
  AppSectionSaveState,
  PagedAppSectionState,
} from 'App/State/AppSectionState';
import Language from 'Language/Language';
import ImportListExclusion from 'typings/ImportListExclusion';
import IndexerFlag from 'typings/IndexerFlag';
import QualityProfile from 'typings/QualityProfile';
import General from 'typings/Settings/General';
import MediaManagement from 'typings/Settings/MediaManagement';
import NamingConfig from 'typings/Settings/NamingConfig';
import NamingExample from 'typings/Settings/NamingExample';
import UiSettings from 'typings/Settings/UiSettings';
import MetadataAppState from './MetadataAppState';

export interface GeneralAppState
  extends AppSectionItemState<General>,
    AppSectionSaveState {}

export interface MediaManagementAppState
  extends AppSectionItemState<MediaManagement>,
    AppSectionSaveState {}

export interface NamingAppState
  extends AppSectionItemState<NamingConfig>,
    AppSectionSaveState {}

export type NamingExamplesAppState = AppSectionItemState<NamingExample>;

export interface QualityProfilesAppState
  extends AppSectionState<QualityProfile>,
    AppSectionItemSchemaState<QualityProfile> {}

export interface ImportListExclusionsSettingsAppState
  extends AppSectionState<ImportListExclusion>,
    AppSectionSaveState,
    PagedAppSectionState,
    AppSectionDeleteState {
  pendingChanges: Partial<ImportListExclusion>;
}

export type IndexerFlagSettingsAppState = AppSectionState<IndexerFlag>;
export type LanguageSettingsAppState = AppSectionState<Language>;
export type UiSettingsAppState = AppSectionItemState<UiSettings>;

interface SettingsAppState {
  advancedSettings: boolean;
  general: GeneralAppState;
  importListExclusions: ImportListExclusionsSettingsAppState;
  indexerFlags: IndexerFlagSettingsAppState;
  languages: LanguageSettingsAppState;
  mediaManagement: MediaManagementAppState;
  metadata: MetadataAppState;
  naming: NamingAppState;
  namingExamples: NamingExamplesAppState;
  qualityProfiles: QualityProfilesAppState;
  ui: UiSettingsAppState;
}

export default SettingsAppState;
