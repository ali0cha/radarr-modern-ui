import { queryClient } from 'App/queryClient';
import useApiQuery, { getApiQueryKey } from 'Helpers/Hooks/useApiQuery';
import UiSettings from 'typings/Settings/UiSettings';

export const UI_SETTINGS_PATH = '/config/ui';

const NO_UI_SETTINGS = {} as UiSettings;

// The settings of the interface are read all over the app, in rows that are
// shown and hidden as the lists scroll: they are fetched once, when the app
// starts, and kept up to date by the page that saves them.
export function useUISettingsQuery() {
  return useApiQuery<UiSettings>({
    path: UI_SETTINGS_PATH,
    queryOptions: {
      retry: false,
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });
}

export function useUISettings() {
  const { data } = useUISettingsQuery();

  return data ?? NO_UI_SETTINGS;
}

// For what is not a component, such as an action
export function getUISettings() {
  const [[, data] = []] = queryClient.getQueriesData<UiSettings>({
    queryKey: getApiQueryKey(UI_SETTINGS_PATH),
  });

  return data ?? NO_UI_SETTINGS;
}

export default useUISettings;
