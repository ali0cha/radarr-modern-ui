import { Error } from './AppSectionState';
import CaptchaAppState from './CaptchaAppState';
import CustomFiltersAppState from './CustomFiltersAppState';
import InteractiveImportAppState from './InteractiveImportAppState';
import MessagesAppState from './MessagesAppState';
import OAuthAppState from './OAuthAppState';
import ProviderOptionsAppState from './ProviderOptionsAppState';
import ReleasesAppState from './ReleasesAppState';
import SystemAppState from './SystemAppState';

interface FilterBuilderPropOption {
  id: string;
  name: string;
}

export interface FilterBuilderProp<T> {
  name: string;
  label: string | (() => string);
  type: string;
  valueType?: string;
  optionsSelector?: (items: T[]) => FilterBuilderPropOption[];
}

export interface PropertyFilter {
  key: string;
  value: boolean | string | number | string[] | number[] | boolean[];
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
  captcha: CaptchaAppState;
  customFilters: CustomFiltersAppState;
  interactiveImport: InteractiveImportAppState;
  oAuth: OAuthAppState;
  providerOptions: ProviderOptionsAppState;
  releases: ReleasesAppState;
  system: SystemAppState;
}

export default AppState;
