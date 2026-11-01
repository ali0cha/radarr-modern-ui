import { isEqual } from 'lodash';
import { create } from 'zustand';
import { ApiError } from 'Helpers/Hooks/useApiQuery';
import Field from 'typings/Field';
import providerAction from 'Utilities/providerAction';

export interface ProviderOptions {
  fields?: Field[];
}

// The actions of the providers that give the options of a select field
export type SelectOptionsProviderAction =
  | 'servers'
  | 'newznabCategories'
  | 'getProfiles'
  | 'getTags'
  | 'getRootFolders';

export interface ProviderOptionsState<T> {
  items: T[];
  isFetching: boolean;
  isPopulated: boolean;
  error: ApiError | null;
}

export const defaultProviderOptionsState: ProviderOptionsState<never> = {
  items: [],
  isFetching: false,
  isPopulated: false,
  error: null,
};

// The options that the fields of the provider that is edited are asked for,
// by the name of the action that gives them. They are forgotten when the input
// is not shown anymore.
const useProviderOptionsStore = create<
  Record<string, ProviderOptionsState<unknown>>
>()(() => ({}));

const { setState } = useProviderOptionsStore;

// What was asked last for each of them: a response is only used when nothing
// asked for the same options since, and when they were not cleared
const lastActions: Record<
  string,
  { actionId: number; payload: unknown } | null
> = {};
let lastActionId = 0;

interface FetchOptionsPayload {
  section: string;
  action: string;
  provider: string;
  providerData: Record<string, unknown>;
}

function updateSection(
  section: string,
  changes: Partial<ProviderOptionsState<unknown>>
) {
  setState((state) => ({
    [section]: {
      ...defaultProviderOptionsState,
      ...state[section],
      ...changes,
    },
  }));
}

export function useProviderOptions<T>(section: string) {
  return useProviderOptionsStore(
    (state) =>
      (state[section] as ProviderOptionsState<T> | undefined) ??
      (defaultProviderOptionsState as ProviderOptionsState<T>)
  );
}

export function fetchOptions(payload: FetchOptionsPayload) {
  const { section, action, provider, providerData } = payload;

  // The same request is not made again while it is being made
  if (lastActions[section] && isEqual(payload, lastActions[section]?.payload)) {
    return;
  }

  const actionId = ++lastActionId;

  lastActions[section] = { actionId, payload };

  updateSection(section, { isFetching: true });

  return providerAction<{ options?: unknown[] }>({
    provider,
    action,
    providerData,
  }).then(
    (data) => {
      if (lastActions[section]?.actionId !== actionId) {
        return;
      }

      lastActions[section] = null;

      updateSection(section, {
        isFetching: false,
        isPopulated: true,
        error: null,
        items: data.options ?? [],
      });
    },
    (error: ApiError) => {
      if (lastActions[section]?.actionId !== actionId) {
        return;
      }

      lastActions[section] = null;

      updateSection(section, {
        isFetching: false,
        isPopulated: false,
        error,
      });
    }
  );
}

export function clearOptions(section: string) {
  lastActions[section] = null;

  setState({ [section]: defaultProviderOptionsState });
}
