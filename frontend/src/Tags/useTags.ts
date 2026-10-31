import { QueryClient, useQueryClient } from '@tanstack/react-query';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import useApiQuery, { getApiQueryKey } from 'Helpers/Hooks/useApiQuery';
import { Tag, TagDetail } from './Tag';

const TAGS_PATH = '/tag';
const TAG_DETAILS_PATH = '/tag/detail';

const NO_TAGS: Tag[] = [];

// Tags are kept up to date by the SignalR handler and by the mutations below,
// so there is no need to refetch them every time a component needs them.
const tagsQueryOptions = {
  retry: false,
  staleTime: Infinity,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

export function useTagsQuery(options: { refetchOnMount?: 'always' } = {}) {
  return useApiQuery<Tag[]>({
    path: TAGS_PATH,
    queryOptions: { ...tagsQueryOptions, ...options },
  });
}

export function useTagDetails() {
  return useApiQuery<TagDetail[]>({
    path: TAG_DETAILS_PATH,
    queryOptions: {
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });
}

export function useAddTag() {
  const queryClient = useQueryClient();

  return useApiMutation<Tag, { label: string }>({
    path: TAGS_PATH,
    method: 'POST',
    mutationOptions: {
      onSuccess: (tag) => {
        queryClient.setQueriesData<Tag[]>(
          { queryKey: getApiQueryKey(TAGS_PATH) },
          (tags) => (tags ? [...tags, tag] : tags)
        );
      },
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useApiMutation<unknown, { id: number }>({
    path: ({ id }) => `${TAGS_PATH}/${id}`,
    method: 'DELETE',
    mutationOptions: {
      onSuccess: (_data, { id }) => {
        queryClient.setQueriesData<Tag[]>(
          { queryKey: getApiQueryKey(TAGS_PATH) },
          (tags) => tags?.filter((tag) => tag.id !== id)
        );

        queryClient.invalidateQueries({
          queryKey: getApiQueryKey(TAG_DETAILS_PATH),
        });
      },
    },
  });
}

// For code outside of React.
export function invalidateTags(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: getApiQueryKey(TAGS_PATH) }),
    queryClient.invalidateQueries({
      queryKey: getApiQueryKey(TAG_DETAILS_PATH),
    }),
  ]);
}

const useTags = () => {
  const { data } = useTagsQuery();

  return data ?? NO_TAGS;
};

export default useTags;
