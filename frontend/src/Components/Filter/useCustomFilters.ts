import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { CustomFilter } from 'App/State/AppState';
import useApiQuery, {
  ApiError,
  fetchApi,
  getApiPath,
  getApiQueryKey,
} from 'Helpers/Hooks/useApiQuery';

export const CUSTOM_FILTERS_PATH = '/customFilter';

// The custom filters are only changed by the app, they are fetched once when it
// starts
const customFiltersQueryOptions = {
  retry: false,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

const NO_CUSTOM_FILTERS: CustomFilter[] = [];

export function useCustomFilters() {
  const { data, isFetching, isSuccess, error } = useApiQuery<CustomFilter[]>({
    path: CUSTOM_FILTERS_PATH,
    queryOptions: customFiltersQueryOptions,
  });

  return {
    customFilters: data ?? NO_CUSTOM_FILTERS,
    isFetching,
    isPopulated: isSuccess,
    error,
  };
}

// For what is not a component, such as the thunks
export function getCustomFilters(queryClient: QueryClient) {
  const [[, data] = []] = queryClient.getQueriesData<CustomFilter[]>({
    queryKey: getApiQueryKey(CUSTOM_FILTERS_PATH),
  });

  return data ?? NO_CUSTOM_FILTERS;
}

function setCustomFilters(
  queryClient: QueryClient,
  update: (customFilters: CustomFilter[]) => CustomFilter[]
) {
  queryClient.setQueriesData<CustomFilter[]>(
    { queryKey: getApiQueryKey(CUSTOM_FILTERS_PATH) },
    (customFilters) => (customFilters ? update(customFilters) : customFilters)
  );
}

interface SaveCustomFilterPayload {
  id?: number;
  type: string;
  label: string;
  filters: CustomFilter['filters'];
}

export function useSaveCustomFilter() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    CustomFilter,
    ApiError,
    SaveCustomFilterPayload
  >({
    mutationFn: (customFilter) =>
      fetchApi<CustomFilter>(
        getApiPath(
          customFilter.id
            ? `${CUSTOM_FILTERS_PATH}/${customFilter.id}`
            : CUSTOM_FILTERS_PATH
        ),
        {
          method: customFilter.id ? 'PUT' : 'POST',
          headers: {
            'X-Api-Key': window.Radarr.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customFilter),
        }
      ),
    onSuccess: (saved) =>
      setCustomFilters(queryClient, (customFilters) =>
        customFilters.some(({ id }) => id === saved.id)
          ? customFilters.map((customFilter) =>
              customFilter.id === saved.id ? saved : customFilter
            )
          : [...customFilters, saved]
      ),
  });

  return { saveCustomFilter: mutate, isSaving: isPending, saveError: error };
}

export function useDeleteCustomFilter() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation<
    unknown,
    ApiError,
    { id: number }
  >({
    mutationFn: ({ id }) =>
      fetchApi(getApiPath(`${CUSTOM_FILTERS_PATH}/${id}`), {
        method: 'DELETE',
        headers: { 'X-Api-Key': window.Radarr.apiKey },
      }),
    onSuccess: (_, { id }) =>
      setCustomFilters(queryClient, (customFilters) =>
        customFilters.filter((customFilter) => customFilter.id !== id)
      ),
  });

  const deleteCustomFilter = useCallback(
    (payload: { id: number }) => mutate(payload),
    [mutate]
  );

  return {
    deleteCustomFilter,
    isDeleting: isPending,
    deleteError: error,
  };
}
