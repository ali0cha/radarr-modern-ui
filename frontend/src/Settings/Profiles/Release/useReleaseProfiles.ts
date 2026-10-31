import { useProviderSettings } from 'Settings/useProviderSettings';
import ReleaseProfile from 'typings/Settings/ReleaseProfile';

export const RELEASE_PROFILES_PATH = '/releaseprofile';

export const NEW_RELEASE_PROFILE: ReleaseProfile = {
  id: 0,
  name: '',
  enabled: true,
  required: [],
  ignored: [],
  tags: [],
  indexerId: 0,
};

export function useReleaseProfiles() {
  const {
    data: items,
    isFetching,
    isSuccess,
    error,
  } = useProviderSettings<ReleaseProfile>(RELEASE_PROFILES_PATH);

  // The profiles are listed in the order of the server
  return { items, isFetching, isPopulated: isSuccess, error };
}
