import React, { ComponentType } from 'react';
import { useQualityProfileSchema } from './useQualityProfiles';

// For the components that are still connected to Redux: gives them the schema
// of the quality profiles, which holds all the qualities, as
// qualityProfileSchemaState.
function withQualityProfileSchema<T extends object>(
  WrappedComponent: ComponentType<T>
) {
  function WithQualityProfileSchema(
    props: Omit<T, 'qualityProfileSchemaState'>
  ) {
    const { data, isFetching, isSuccess, error } = useQualityProfileSchema();

    const qualityProfileSchemaState = {
      schema: data,
      isFetching,
      isPopulated: isSuccess,
      error,
    };

    return (
      <WrappedComponent
        {...(props as T)}
        qualityProfileSchemaState={qualityProfileSchemaState}
      />
    );
  }

  return WithQualityProfileSchema;
}

export default withQualityProfileSchema;
