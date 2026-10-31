import React, { ComponentType } from 'react';
import useLanguages from './useLanguages';

// For the components that are still connected to Redux: gives them the
// languages, as languagesState.
function withLanguages<T extends object>(WrappedComponent: ComponentType<T>) {
  function WithLanguages(props: Omit<T, 'languagesState'>) {
    const languagesState = useLanguages();

    return (
      <WrappedComponent {...(props as T)} languagesState={languagesState} />
    );
  }

  return WithLanguages;
}

export default withLanguages;
