import { keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import NamingConfig from 'typings/Settings/NamingConfig';
import NamingExample from 'typings/Settings/NamingExample';

const NO_EXAMPLES = {} as NamingExample;
const DELAY = 1000;

// The examples of what the files and folders are named with the naming
// settings, as they are being edited. They are asked for a second after the
// last change.
export function useNamingExamples(naming?: NamingConfig) {
  const serialized = naming
    ? new URLSearchParams(
        Object.entries(naming).map(([key, value]) => [key, String(value)])
      ).toString()
    : null;

  const [requested, setRequested] = useState<string | null>(null);

  useEffect(() => {
    if (serialized === null) {
      return;
    }

    if (requested === null) {
      setRequested(serialized);

      return;
    }

    const timeout = setTimeout(() => setRequested(serialized), DELAY);

    return () => clearTimeout(timeout);
  }, [serialized, requested]);

  const { data, isSuccess } = useApiQuery<NamingExample>({
    path: `/config/naming/examples?${requested ?? ''}`,
    queryOptions: {
      enabled: requested !== null,
      retry: false,
      placeholderData: keepPreviousData,
    },
  });

  return { examples: data ?? NO_EXAMPLES, isPopulated: isSuccess };
}
