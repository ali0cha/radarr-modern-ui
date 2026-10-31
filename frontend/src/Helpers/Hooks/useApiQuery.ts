import {
  QueryClient,
  UndefinedInitialDataOptions,
  useQuery,
} from '@tanstack/react-query';
import { useMemo } from 'react';

interface ApiErrorResponse {
  message: string;
  details: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public statusText: string;
  public statusBody?: ApiErrorResponse;

  public constructor(
    path: string,
    statusCode: number,
    statusText: string,
    statusBody?: ApiErrorResponse
  ) {
    super(`Request Error: (${statusCode}) ${path}`);

    this.statusCode = statusCode;
    this.statusText = statusText;
    this.statusBody = statusBody;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

interface QueryOptions<T> {
  path: string;
  headers?: HeadersInit;
  queryOptions?:
    | Omit<UndefinedInitialDataOptions<T, ApiError>, 'queryKey' | 'queryFn'>
    | undefined;
}

const apiRoot = window.Radarr.apiRoot;

export function getApiPath(path: string) {
  return apiRoot + path;
}

// Matches the queries made by useApiQuery for a path, whatever the headers.
// Use it to invalidate or update them.
export function getApiQueryKey(path: string) {
  return [getApiPath(path)];
}

// Invalidates every query whose path starts with the given one, including
// those with a query string, e.g. '/history/movie' for '/history/movie?movieId=1'.
export function invalidateApiQueries(queryClient: QueryClient, path: string) {
  const prefix = getApiPath(path);

  return queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      typeof queryKey[0] === 'string' && queryKey[0].startsWith(prefix),
  });
}

export async function fetchApi<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(path, init);

  if (!response.ok) {
    // eslint-disable-next-line init-declarations
    let body;

    try {
      body = (await response.json()) as ApiErrorResponse;
    } catch {
      throw new ApiError(path, response.status, response.statusText);
    }

    throw new ApiError(path, response.status, response.statusText, body);
  }

  // Some requests, such as deleting an item, answer with an empty body.
  const text = await response.text();

  return (text ? JSON.parse(text) : undefined) as T;
}

function useApiQuery<T>(options: QueryOptions<T>) {
  const { path, headers } = useMemo(() => {
    return {
      path: getApiPath(options.path),
      headers: {
        ...options.headers,
        'X-Api-Key': window.Radarr.apiKey,
      },
    };
  }, [options]);

  return useQuery({
    ...options.queryOptions,
    queryKey: [path, headers],
    queryFn: ({ signal }) => fetchApi<T>(path, { headers, signal }),
  });
}

export default useApiQuery;
