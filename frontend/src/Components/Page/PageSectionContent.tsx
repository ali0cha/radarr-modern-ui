import React from 'react';
import { Error } from 'App/State/AppSectionState';
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import { ApiError } from 'Helpers/Hooks/useApiQuery';
import { kinds } from 'Helpers/Props';

interface PageSectionContentProps {
  isFetching: boolean;
  isPopulated: boolean;
  error?: Error | ApiError;
  errorMessage: string;
  children: React.ReactNode;
}

function PageSectionContent({
  isFetching,
  isPopulated,
  error,
  errorMessage,
  children,
}: PageSectionContentProps) {
  if (isFetching && !isPopulated) {
    return <LoadingIndicator />;
  }

  if (!isFetching && !!error) {
    return <Alert kind={kinds.DANGER}>{errorMessage}</Alert>;
  }

  if (isPopulated && !error) {
    return <div>{children}</div>;
  }

  return null;
}

export default PageSectionContent;
