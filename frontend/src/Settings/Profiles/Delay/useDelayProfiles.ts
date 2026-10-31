import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import useApiMutation from 'Helpers/Hooks/useApiMutation';
import { getApiQueryKey } from 'Helpers/Hooks/useApiQuery';
import { useProviderSettings } from 'Settings/useProviderSettings';
import DelayProfile from 'typings/DelayProfile';

export const DELAY_PROFILES_PATH = '/delayprofile';

// The default profile always has this id, and cannot be moved or deleted.
export const DEFAULT_DELAY_PROFILE_ID = 1;

export const NEW_DELAY_PROFILE = {
  enableUsenet: true,
  enableTorrent: true,
  preferredProtocol: 'usenet',
  usenetDelay: 0,
  torrentDelay: 0,
  bypassIfHighestQuality: false,
  bypassIfAboveCustomFormatScore: false,
  minimumCustomFormatScore: 0,
  tags: [],
} as unknown as DelayProfile;

export function useDelayProfiles() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<DelayProfile>(DELAY_PROFILES_PATH);

  const { defaultProfile, items } = useMemo(() => {
    return {
      defaultProfile: data.find(
        (profile) => profile.id === DEFAULT_DELAY_PROFILE_ID
      ),
      items: data
        .filter((profile) => profile.id !== DEFAULT_DELAY_PROFILE_ID)
        .sort((a, b) => a.order - b.order),
    };
  }, [data]);

  return { defaultProfile, items, isFetching, isPopulated: isSuccess, error };
}

interface ReorderRequest {
  id: number;
  // The profile it goes after, none to put it first
  after?: number;
}

// The server answers with the profiles in their new order.
export function useReorderDelayProfile() {
  const queryClient = useQueryClient();

  const { mutate } = useApiMutation<DelayProfile[], ReorderRequest>({
    path: ({ id, after }) =>
      `${DELAY_PROFILES_PATH}/reorder/${id}${after ? `?after=${after}` : ''}`,
    method: 'PUT',
    sendBody: false,
    mutationOptions: {
      onSuccess: (profiles) => {
        queryClient.setQueriesData<DelayProfile[]>(
          { queryKey: getApiQueryKey(DELAY_PROFILES_PATH) },
          profiles
        );
      },
    },
  });

  // moveIndex is where the profile goes among the profiles that can be moved
  return useCallback(
    (profiles: DelayProfile[], id: number, moveIndex: number) => {
      const moveOrder = moveIndex + 1;
      const moving = profiles.find((profile) => profile.id === id);

      // Don't move if the order hasn't changed
      if (!moving || moving.order === moveOrder) {
        return;
      }

      const after =
        moveIndex > 0
          ? profiles.find((profile) => profile.order === moveIndex)
          : undefined;

      mutate({ id, after: after?.id });
    },
    [mutate]
  );
}
