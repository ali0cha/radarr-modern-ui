import AppSectionState, {
  AppSectionDeleteState,
  AppSectionItemSchemaState,
  AppSectionItemState,
  AppSectionSaveState,
  AppSectionSchemaState,
  PagedAppSectionState,
} from 'App/State/AppSectionState';
import Language from 'Language/Language';
import AutoTagging, { AutoTaggingSpecification } from 'typings/AutoTagging';
import DelayProfile from 'typings/DelayProfile';
import ImportListExclusion from 'typings/ImportListExclusion';
import IndexerFlag from 'typings/IndexerFlag';
import QualityProfile from 'typings/QualityProfile';
import General from 'typings/Settings/General';
import MediaManagement from 'typings/Settings/MediaManagement';
import NamingConfig from 'typings/Settings/NamingConfig';
import NamingExample from 'typings/Settings/NamingExample';
import ReleaseProfile from 'typings/Settings/ReleaseProfile';
import UiSettings from 'typings/Settings/UiSettings';
import MetadataAppState from './MetadataAppState';

export interface AutoTaggingAppState
  extends AppSectionState<AutoTagging>,
    AppSectionDeleteState,
    AppSectionSaveState {}

export interface AutoTaggingSpecificationAppState
  extends AppSectionState<AutoTaggingSpecification>,
    AppSectionDeleteState,
    AppSectionSaveState,
    AppSectionSchemaState<AutoTaggingSpecification> {}

export interface DelayProfileAppState
  extends AppSectionState<DelayProfile>,
    AppSectionDeleteState,
    AppSectionSaveState {}

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

export interface ReleaseProfilesAppState
  extends AppSectionState<ReleaseProfile>,
    AppSectionSaveState {
  pendingChanges: Partial<ReleaseProfile>;
}

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
  autoTaggings: AutoTaggingAppState;
  autoTaggingSpecifications: AutoTaggingSpecificationAppState;
  delayProfiles: DelayProfileAppState;
  general: GeneralAppState;
  importListExclusions: ImportListExclusionsSettingsAppState;
  indexerFlags: IndexerFlagSettingsAppState;
  languages: LanguageSettingsAppState;
  mediaManagement: MediaManagementAppState;
  metadata: MetadataAppState;
  naming: NamingAppState;
  namingExamples: NamingExamplesAppState;
  qualityProfiles: QualityProfilesAppState;
  releaseProfiles: ReleaseProfilesAppState;
  ui: UiSettingsAppState;
}

export default SettingsAppState;
