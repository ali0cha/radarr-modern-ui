import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ApiError, fetchApi, getApiPath } from './useApiQuery';

interface MutationOptions<TData, TVariables> {
  // A function builds the path from the variables, e.g. to delete by id.
  path: string | ((variables: TVariables) => string);
  method: 'POST' | 'PUT' | 'DELETE';
  mutationOptions?: Omit<
    UseMutationOptions<TData, ApiError, TVariables>,
    'mutationFn'
  >;
}

// The variables are sent as the JSON body, except for DELETE.
function useApiMutation<TData, TVariables = void>({
  path,
  method,
  mutationOptions,
}: MutationOptions<TData, TVariables>) {
  return useMutation<TData, ApiError, TVariables>({
    ...mutationOptions,
    mutationFn: (variables) => {
      const hasBody = method !== 'DELETE';

      return fetchApi<TData>(
        getApiPath(typeof path === 'function' ? path(variables) : path),
        {
          method,
          headers: {
            'X-Api-Key': window.Radarr.apiKey,
            ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
          },
          body: hasBody ? JSON.stringify(variables) : undefined,
        }
      );
    },
  });
}

export default useApiMutation;
