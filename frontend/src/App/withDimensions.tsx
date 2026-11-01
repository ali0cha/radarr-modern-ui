import React, { ComponentType } from 'react';
import { Dimensions, useDimensions } from './useAppStore';

// For the components that are still connected to Redux: gives them the size of
// the window, as dimensions.
function withDimensions<T extends object>(WrappedComponent: ComponentType<T>) {
  function WithDimensions(props: Omit<T, 'dimensions'>) {
    const dimensions: Dimensions = useDimensions();

    return <WrappedComponent {...(props as T)} dimensions={dimensions} />;
  }

  return WithDimensions;
}

export default withDimensions;
