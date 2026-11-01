import React, { ComponentType } from 'react';
import { useAddDefaults } from './useAddMovie';

// For the components that are still connected to Redux: gives them what was
// used the last time that a movie was added, as addDefaults.
function withAddDefaults<T extends object>(WrappedComponent: ComponentType<T>) {
  function WithAddDefaults(props: Omit<T, 'addDefaults'>) {
    const addDefaults = useAddDefaults();

    return <WrappedComponent {...(props as T)} addDefaults={addDefaults} />;
  }

  return WithAddDefaults;
}

export default withAddDefaults;
