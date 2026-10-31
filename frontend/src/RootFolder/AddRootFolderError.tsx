import React from 'react';
import Alert from 'Components/Alert';
import { ApiError } from 'Helpers/Hooks/useApiQuery';
import { kinds } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

interface AddRootFolderErrorProps {
  className?: string;
  error: ApiError;
}

interface ValidationFailure {
  errorMessage: string;
}

function AddRootFolderError({ className, error }: AddRootFolderErrorProps) {
  // The server answers with a list of validation failures when it refuses the
  // path, and with an error message otherwise.
  const body: unknown = error.statusBody;

  return (
    <Alert className={className} kind={kinds.DANGER}>
      {translate('AddRootFolderError')}

      <ul>
        {Array.isArray(body) ? (
          (body as ValidationFailure[]).map((failure, index) => {
            return <li key={index}>{failure.errorMessage}</li>;
          })
        ) : (
          <li>{body ? JSON.stringify(body) : error.message}</li>
        )}
      </ul>
    </Alert>
  );
}

export default AddRootFolderError;
