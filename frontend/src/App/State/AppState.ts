import { Error } from './AppSectionState';
import BlocklistAppState from './BlocklistAppState';
import CalendarAppState from './CalendarAppState';
import CaptchaAppState from './CaptchaAppState';
import CommandAppState from './CommandAppState';
import CustomFiltersAppState from './CustomFiltersAppState';
import HistoryAppState from './HistoryAppState';
import InteractiveImportAppState from './InteractiveImportAppState';
import MessagesAppState from './MessagesAppState';
import MovieCollectionAppState from './MovieCollectionAppState';
import MovieFilesAppState from './MovieFilesAppState';
import MoviesAppState, { MovieIndexAppState } from './MoviesAppState';
import OAuthAppState from './OAuthAppState';
import PathsAppState from './PathsAppState';
import ProviderOptionsAppState from './ProviderOptionsAppState';
import QueueAppState from './QueueAppState';
import ReleasesAppState from './ReleasesAppState';
import SettingsAppState from './SettingsAppState';
import SystemAppState from './SystemAppState';
import WantedAppState from './WantedAppState';

interface FilterBuilderPropOption {
  id: string;
  name: string;
}

export interface FilterBuilderProp<T> {
  name: string;
  label: string;
  type: string;
  valueType?: string;
  optionsSelector?: (items: T[]) => FilterBuilderPropOption[];
}

export interface PropertyFilter {
  key: string;
  value: boolean | string | number | string[] | number[];
  type: string;
}

export interface Filter {
  key: string;
  label: string | (() => string);
  filters: PropertyFilter[];
}

export interface CustomFilter {
  id: number;
  type: string;
  label: string;
  filters: PropertyFilter[];
}

export interface AppSectionState {
  isUpdated: boolean;
  isConnected: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  isSidebarVisible: boolean;
  version: string;
  prevVersion?: string;
  dimensions: {
    isSmallScreen: boolean;
    isLargeScreen: boolean;
    width: number;
    height: number;
  };
  translations: {
    error?: Error;
    isPopulated: boolean;
  };
  messages: MessagesAppState;
}

interface AppState {
  app: AppSectionState;
  blocklist: BlocklistAppState;
  calendar: CalendarAppState;
  captcha: CaptchaAppState;
  commands: CommandAppState;
  customFilters: CustomFiltersAppState;
  history: HistoryAppState;
  interactiveImport: InteractiveImportAppState;
  movieCollections: MovieCollectionAppState;
  movieFiles: MovieFilesAppState;
  movieIndex: MovieIndexAppState;
  movies: MoviesAppState;
  oAuth: OAuthAppState;
  paths: PathsAppState;
  providerOptions: ProviderOptionsAppState;
  queue: QueueAppState;
  releases: ReleasesAppState;
  settings: SettingsAppState;
  system: SystemAppState;
  wanted: WantedAppState;
}

export default AppState;
