import { useMemo } from 'react';
import useApiQuery from 'Helpers/Hooks/useApiQuery';
import Language from 'Language/Language';

const NO_LANGUAGES: Language[] = [];
const NO_EXCLUSIONS: string[] = [];

// The languages the server knows do not change while the app is open.
export function useLanguages(exclude: string[] = NO_EXCLUSIONS) {
  const { data, isFetching, isSuccess, error } = useApiQuery<Language[]>({
    path: '/language',
    queryOptions: {
      retry: false,
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });

  const items = useMemo(() => {
    const languages = data ?? NO_LANGUAGES;

    return exclude.length
      ? languages.filter((language) => !exclude.includes(language.name))
      : languages;
  }, [data, exclude]);

  return { items, isFetching, isPopulated: isSuccess, error };
}

export default useLanguages;
