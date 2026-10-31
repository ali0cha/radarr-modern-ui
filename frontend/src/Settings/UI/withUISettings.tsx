import React, { ComponentType } from 'react';
import useUISettings from './useUISettings';

// For the components that are still connected to Redux: gives them the
// settings of the interface, as uiSettings.
function withUISettings<T extends object>(WrappedComponent: ComponentType<T>) {
  function WithUISettings(props: Omit<T, 'uiSettings'>) {
    const uiSettings = useUISettings();

    return <WrappedComponent {...(props as T)} uiSettings={uiSettings} />;
  }

  return WithUISettings;
}

export default withUISettings;
