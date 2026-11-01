import { create } from 'zustand';
import { Message } from 'App/State/MessagesAppState';
import { fetchApi, getApiPath } from 'Helpers/Hooks/useApiQuery';
import { fetchTranslations as fetchAppTranslations } from 'Utilities/String/translate';

export interface Dimensions {
  width: number;
  height: number;
  isExtraSmallScreen: boolean;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
}

function getDimensions(width: number, height: number): Dimensions {
  return {
    width,
    height,
    isExtraSmallScreen: width <= 480,
    isSmallScreen: width <= 768,
    isMediumScreen: width <= 992,
    isLargeScreen: width <= 1200,
  };
}

interface Translations {
  isFetching: boolean;
  isPopulated: boolean;
  error: string | null;
}

interface AppStoreState {
  dimensions: Dimensions;
  messages: Message[];
  version: string;
  // The version that the application had before it was updated
  prevVersion?: string;
  isUpdated: boolean;
  isConnected: boolean;
  isReconnecting: boolean;
  isDisconnected: boolean;
  isRestarting: boolean;
  isSidebarVisible: boolean;
  translations: Translations;
}

const initialDimensions = getDimensions(window.innerWidth, window.innerHeight);

// What the whole app shares and does not keep: the size of the window, the
// messages, the version, the connection to the server and the sidebar.
export const useAppStore = create<AppStoreState>()(() => ({
  dimensions: initialDimensions,
  messages: [],
  version: window.Radarr.version,
  isUpdated: false,
  isConnected: true,
  isReconnecting: false,
  isDisconnected: false,
  isRestarting: false,
  isSidebarVisible: !initialDimensions.isSmallScreen,
  translations: {
    isFetching: true,
    isPopulated: false,
    error: null,
  },
}));

const { setState, getState } = useAppStore;

export const useDimensions = () => useAppStore((state) => state.dimensions);

export const useIsSidebarVisible = () =>
  useAppStore((state) => state.isSidebarVisible);

export function saveDimensions({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  setState({ dimensions: getDimensions(width, height) });
}

// A message that is shown again is updated, whatever its id
export function showMessage(message: Message) {
  setState(({ messages }) => {
    const index = messages.findIndex(({ id }) => id === message.id);

    if (index < 0) {
      return { messages: [...messages, message] };
    }

    const items = [...messages];

    items[index] = { ...items[index], ...message };

    return { messages: items };
  });
}

export function hideMessage({ id }: { id: number }) {
  setState(({ messages }) => ({
    messages: messages.filter((message) => message.id !== id),
  }));
}

export function setVersion({ version }: { version: string }) {
  setState((state) => {
    if (state.version === version) {
      return { version };
    }

    return {
      version,
      prevVersion: state.prevVersion ?? state.version,
      isUpdated: true,
    };
  });
}

export function setAppValue(values: Partial<AppStoreState>) {
  setState(values);
}

export function setIsSidebarVisible({
  isSidebarVisible,
}: {
  isSidebarVisible: boolean;
}) {
  setState({ isSidebarVisible });
}

export async function fetchTranslations() {
  const isFetchingComplete = await fetchAppTranslations();

  setState({
    translations: {
      isFetching: false,
      isPopulated: isFetchingComplete,
      error: isFetchingComplete ? null : 'Failed to load translations from API',
    },
  });
}

let pingTimeout: ReturnType<typeof setTimeout> | null = null;
let abortPing: AbortController | null = null;

// Asks the server for its status until it answers, after it was restarted
export function pingServer() {
  abortPing?.abort();
  abortPing = null;

  if (pingTimeout) {
    clearTimeout(pingTimeout);
  }

  pingTimeout = setTimeout(() => {
    pingTimeout = null;

    const { isRestarting, isConnected } = getState();

    if (!isRestarting && isConnected) {
      return;
    }

    const controller = new AbortController();

    abortPing = controller;

    fetchApi(getApiPath('/system/status'), {
      headers: { 'X-Api-Key': window.Radarr.apiKey },
      signal: controller.signal,
    }).then(
      () => {
        abortPing = null;
        setState({ isRestarting: false });
      },
      (error: { statusCode?: number }) => {
        abortPing = null;

        // Unauthorized, but back online
        if (error.statusCode === 401) {
          setState({ isRestarting: false });
        } else if (!controller.signal.aborted) {
          pingServer();
        }
      }
    );
  }, 5000);
}
