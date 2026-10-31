import useApiQuery from 'Helpers/Hooks/useApiQuery';
import { ExtraFile } from 'MovieFile/ExtraFile';

function useExtraFiles(movieId: number) {
  return useApiQuery<ExtraFile[]>({
    path: `/extraFile?movieId=${movieId}`,
    queryOptions: {
      retry: false,
      // The files are dropped when the movie page closes, like they used to be
      gcTime: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });
}

export default useExtraFiles;
