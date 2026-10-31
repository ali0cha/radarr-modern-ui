import AppSectionState, {
  AppSectionDeleteState,
  AppSectionItemState,
  AppSectionSaveState,
  PagedAppSectionState,
} from 'App/State/AppSectionState';
import ImportListExclusion from 'typings/ImportListExclusion';
import UiSettings from 'typings/Settings/UiSettings';

export interface ImportListExclusionsSettingsAppState
  extends AppSectionState<ImportListExclusion>,
    AppSectionSaveState,
    PagedAppSectionState,
    AppSectionDeleteState {
  pendingChanges: Partial<ImportListExclusion>;
}

export type UiSettingsAppState = AppSectionItemState<UiSettings>;

interface SettingsAppState {
  advancedSettings: boolean;
  importListExclusions: ImportListExclusionsSettingsAppState;
  ui: UiSettingsAppState;
}

export default SettingsAppState;
