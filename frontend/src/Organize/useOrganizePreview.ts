import useApiQuery from 'Helpers/Hooks/useApiQuery';
import { OrganizePreviewModel } from './OrganizePreviewModel';

function useOrganizePreview(movieId: number) {
  return useApiQuery<OrganizePreviewModel[]>({
    path: `/rename?movieId=${movieId}`,
    queryOptions: {
      retry: false,
      // The preview is dropped when the modal closes. It would be outdated the
      // next time, as the files may have been renamed in between.
      gcTime: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });
}

export default useOrganizePreview;
