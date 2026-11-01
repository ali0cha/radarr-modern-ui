import { fetchApi, getApiPath } from 'Helpers/Hooks/useApiQuery';

interface ProviderActionPayload {
  provider: string;
  action: string;
  providerData: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
}

// The fields are sent as they are, the other properties as their value
function flattenProviderData(providerData: Record<string, unknown>) {
  return Object.keys(providerData).reduce<Record<string, unknown>>(
    (result, key) => {
      const property = providerData[key];

      result[key] =
        key === 'fields' ? property : (property as { value: unknown }).value;

      return result;
    },
    {}
  );
}

// Asks a provider (an indexer, a download client, ...) to do one of its
// actions, such as getting its options
function providerAction<T>({
  provider,
  action,
  providerData,
  queryParams,
}: ProviderActionPayload) {
  const query = queryParams
    ? `?${new URLSearchParams(
        Object.entries(queryParams).map(([key, value]) => [
          key,
          String(value ?? ''),
        ])
      )}`
    : '';

  return fetchApi<T>(getApiPath(`/${provider}/action/${action}${query}`), {
    method: 'POST',
    headers: {
      'X-Api-Key': window.Radarr.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flattenProviderData(providerData)),
  });
}

export default providerAction;
