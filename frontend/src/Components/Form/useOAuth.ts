import { create } from 'zustand';
import { ApiError, fetchApi } from 'Helpers/Hooks/useApiQuery';
import providerAction from 'Utilities/providerAction';
import translate from 'Utilities/String/translate';

const callbackUrl = `${window.location.origin}${window.Radarr.urlBase}/oauth.html`;

interface OAuthState {
  authorizing: boolean;
  result: Record<string, unknown> | null;
  error: ApiError | null;
}

const defaultState: OAuthState = {
  authorizing: false,
  result: null,
  error: null,
};

// The result of the last authorization, it is forgotten when the input that
// started it is not shown anymore
export const useOAuthStore = create<OAuthState>()(() => defaultState);

const { setState } = useOAuthStore;

interface OAuthPayload {
  name: string;
  provider: string;
  providerData: Record<string, unknown>;
}

// What the provider answers when it starts: where to sign in, or a request to
// make first to get there
interface StartResponse {
  oauthUrl?: string;
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

type OnCompleteOAuth = (query: string, onComplete: () => void) => void;

// Opens the window of the provider, the landing page of the callback gives back
// what the provider added to its url
function showOAuthWindow(url: string, name: string) {
  const newWindow = window.open(url);

  if (
    !newWindow ||
    newWindow.closed ||
    typeof newWindow.closed === 'undefined'
  ) {
    // A fake validation error to mimic a 400 response from the API
    return Promise.reject(
      new ApiError(url, 400, 'Bad Request', [
        {
          propertyName: name,
          errorMessage: translate('OAuthPopupMessage'),
        },
      ] as never)
    );
  }

  return new Promise<Record<string, string>>((resolve) => {
    const selfWindow = window as unknown as {
      onCompleteOauth?: OnCompleteOAuth;
    };

    selfWindow.onCompleteOauth = (query, onComplete) => {
      delete selfWindow.onCompleteOauth;

      const queryParams: Record<string, string> = {};

      query
        .substring(1)
        .split('&')
        .forEach((param) => {
          if (param) {
            const [key, value] = param.split('=');

            queryParams[key] = value;
          }
        });

      onComplete();
      resolve(queryParams);
    };
  });
}

export function resetOAuth() {
  setState(defaultState);
}

// Signs in with the provider and gets the values to fill the fields with
export function startOAuth({ name, provider, providerData }: OAuthPayload) {
  setState({ authorizing: true });

  let startResponse: StartResponse = {};

  return providerAction<StartResponse>({
    provider,
    action: 'startOAuth',
    providerData,
    queryParams: { callbackUrl },
  })
    .then((response) => {
      startResponse = response;

      if (response.oauthUrl) {
        return showOAuthWindow(response.oauthUrl, name);
      }

      // Some providers need a request to be made first, with the options that
      // they gave
      return fetchApi<Record<string, unknown>>(response.url as string, {
        method: response.method,
        headers: response.headers,
      })
        .then((data) =>
          providerAction<StartResponse>({
            provider,
            action: 'continueOAuth',
            providerData,
            queryParams: { ...data, callbackUrl },
          })
        )
        .then((intermediateResponse) => {
          startResponse = intermediateResponse;

          return showOAuthWindow(intermediateResponse.oauthUrl as string, name);
        });
    })
    .then((queryParams) =>
      providerAction<Record<string, unknown>>({
        provider,
        action: 'getOAuthToken',
        providerData,
        queryParams: { ...startResponse, ...queryParams },
      })
    )
    .then(
      (result) => setState({ authorizing: false, result, error: null }),
      (error: ApiError) => setState({ authorizing: false, result: null, error })
    );
}
