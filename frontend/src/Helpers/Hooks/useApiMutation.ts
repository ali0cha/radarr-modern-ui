import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, fetchApi, getApiPath } from './useApiQuery';

interface MutationOptions<TData, TVariables> {
  // A function builds the path from the variables, e.g. to delete by id.
  path: string | ((variables: TVariables) => string);
  method: 'POST' | 'PUT' | 'DELETE';
  // The variables are sent as the JSON body, except for DELETE or when this is
  // false, e.g. for a POST that only needs the path.
  sendBody?: boolean;
  mutationOptions?: Omit<
    UseMutationOptions<TData, ApiError, TVariables>,
    'mutationFn'
  >;
}

function useApiMutation<TData, TVariables = void>({
  path,
  method,
  sendBody = method !== 'DELETE',
  mutationOptions,
}: MutationOptions<TData, TVariables>) {
  return useMutation<TData, ApiError, TVariables>({
    ...mutationOptions,
    mutationFn: (variables) => {
      return fetchApi<TData>(
        getApiPath(typeof path === 'function' ? path(variables) : path),
        {
          method,
          headers: {
            'X-Api-Key': window.Radarr.apiKey,
            ...(sendBody ? { 'Content-Type': 'application/json' } : {}),
          },
          body: sendBody ? JSON.stringify(variables) : undefined,
        }
      );
    },
  });
}

export default useApiMutation;
