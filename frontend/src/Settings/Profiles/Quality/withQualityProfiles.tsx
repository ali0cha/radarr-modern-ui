import React, { ComponentType } from 'react';
import { useQualityProfiles } from './useQualityProfiles';

// For the components that are still connected to Redux: gives them the
// quality profiles, as qualityProfilesState.
function withQualityProfiles<T extends object>(
  WrappedComponent: ComponentType<T>
) {
  function WithQualityProfiles(props: Omit<T, 'qualityProfilesState'>) {
    const qualityProfilesState = useQualityProfiles();

    return (
      <WrappedComponent
        {...(props as T)}
        qualityProfilesState={qualityProfilesState}
      />
    );
  }

  return WithQualityProfiles;
}

export default withQualityProfiles;
