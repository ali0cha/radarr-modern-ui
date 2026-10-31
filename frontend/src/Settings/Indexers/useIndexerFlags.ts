import useApiQuery from 'Helpers/Hooks/useApiQuery';
import IndexerFlag from 'typings/IndexerFlag';

const NO_INDEXER_FLAGS: IndexerFlag[] = [];

// The flags the server knows do not change while the app is open.
export function useIndexerFlags() {
  const { data, isFetching, isSuccess, error } = useApiQuery<IndexerFlag[]>({
    path: '/indexerFlag',
    queryOptions: {
      retry: false,
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });

  return {
    items: data ?? NO_INDEXER_FLAGS,
    isFetching,
    isPopulated: isSuccess,
    error,
  };
}

export default useIndexerFlags;
