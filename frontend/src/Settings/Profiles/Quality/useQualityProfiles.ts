import { useMemo } from 'react';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import { useProviderSettings } from 'Settings/useProviderSettings';
import QualityProfile from 'typings/QualityProfile';
import sortByProp from 'Utilities/Array/sortByProp';

export const QUALITY_PROFILES_PATH = '/qualityprofile';

export function useQualityProfiles() {
  const { data, isFetching, isSuccess, error } =
    useProviderSettings<QualityProfile>(QUALITY_PROFILES_PATH);

  const items = useMemo(() => [...data].sort(sortByProp('name')), [data]);

  return { items, isFetching, isPopulated: isSuccess, error };
}

export function useQualityProfile(qualityProfileId?: number) {
  const { items } = useQualityProfiles();

  return useMemo(
    () => items.find((profile) => profile.id === qualityProfileId),
    [items, qualityProfileId]
  );
}

// The profile that a new profile starts from: all the qualities, none allowed
export function useQualityProfileSchema() {
  return useApiQuery<QualityProfile>({
    path: `${QUALITY_PROFILES_PATH}/schema`,
    queryOptions: {
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });
}
