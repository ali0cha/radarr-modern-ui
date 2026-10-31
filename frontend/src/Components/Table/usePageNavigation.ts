import { useCallback, useMemo, useState } from 'react';

// The page that is shown of a collection that the server cuts in pages
export function usePageState() {
  const [page, setPage] = useState(1);

  return { page, setPage };
}

interface PagerOptions {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

// The handlers of the pager, once the number of pages is known
export function usePagerHandlers({ page, totalPages, setPage }: PagerOptions) {
  const handleFirstPagePress = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const handlePreviousPagePress = useCallback(() => {
    setPage(Math.max(page - 1, 1));
  }, [page, setPage]);

  const handleNextPagePress = useCallback(() => {
    setPage(Math.min(page + 1, totalPages));
  }, [page, totalPages, setPage]);

  const handleLastPagePress = useCallback(() => {
    setPage(totalPages);
  }, [totalPages, setPage]);

  const handlePageSelect = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  return useMemo(
    () => ({
      handleFirstPagePress,
      handlePreviousPagePress,
      handleNextPagePress,
      handleLastPagePress,
      handlePageSelect,
    }),
    [
      handleFirstPagePress,
      handlePreviousPagePress,
      handleNextPagePress,
      handleLastPagePress,
      handlePageSelect,
    ]
  );
}
