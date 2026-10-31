import AppSectionState, {
  AppSectionDeleteState,
  AppSectionSaveState,
  PagedAppSectionState,
} from 'App/State/AppSectionState';
import ImportListExclusion from 'typings/ImportListExclusion';

export interface ImportListExclusionsSettingsAppState
  extends AppSectionState<ImportListExclusion>,
    AppSectionSaveState,
    PagedAppSectionState,
    AppSectionDeleteState {
  pendingChanges: Partial<ImportListExclusion>;
}

interface SettingsAppState {
  advancedSettings: boolean;
  importListExclusions: ImportListExclusionsSettingsAppState;
}

export default SettingsAppState;
