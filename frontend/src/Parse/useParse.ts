import { keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import { ParseModel } from './ParseModel';

const PARSE_DELAY = 300;

function useParse(title: string) {
  const trimmedTitle = title.trim();
  const [debouncedTitle] = useDebounce(trimmedTitle, PARSE_DELAY);

  const { data, isFetching, error } = useApiQuery<ParseModel>({
    path: `/parse?title=${encodeURIComponent(debouncedTitle)}`,
    queryOptions: {
      enabled: !!trimmedTitle && !!debouncedTitle,
      // Keep showing the previous result until the new one arrives
      placeholderData: keepPreviousData,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });

  return {
    isFetching,
    error,
    // An empty title clears the result right away
    item: trimmedTitle ? data : undefined,
  };
}

export default useParse;
