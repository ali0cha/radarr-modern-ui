import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import AppState from 'App/State/AppState';
import { useInitializeLanguage } from 'Language/useLanguageName';
import { useLanguages } from 'Language/useLanguages';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import { useIndexerFlags } from 'Settings/Indexers/useIndexerFlags';
import { useQualityProfiles } from 'Settings/Profiles/Quality/useQualityProfiles';
import { useUISettingsQuery } from 'Settings/UI/useUISettings';
import { fetchTranslations } from 'Store/Actions/appActions';
import { fetchCustomFilters } from 'Store/Actions/customFilterActions';
import { fetchMovies } from 'Store/Actions/movieActions';
import { fetchMovieCollections } from 'Store/Actions/movieCollectionActions';
import { fetchStatus } from 'Store/Actions/systemActions';
import { useTagsQuery } from 'Tags/useTags';

const createErrorsSelector = () =>
  createSelector(
    (state: AppState) => state.movies.error,
    (state: AppState) => state.movieCollections.error,
    (state: AppState) => state.customFilters.error,
    (state: AppState) => state.system.status.error,
    (state: AppState) => state.app.translations.error,
    (
      moviesError,
      movieCollectionsError,
      customFiltersError,
      systemStatusError,
      translationsError
    ) => {
      const hasError = !!(
        moviesError ||
        movieCollectionsError ||
        customFiltersError ||
        systemStatusError ||
        translationsError
      );

      return {
        hasError,
        errors: {
          moviesError,
          movieCollectionsError,
          customFiltersError,
          systemStatusError,
          translationsError,
        },
      };
    }
  );

const useAppPage = () => {
  const dispatch = useDispatch();

  useInitializeLanguage();

  const { isSuccess: isTagsPopulated, error: tagsError } = useTagsQuery();
  const { isPopulated: isImportListsPopulated, error: importListsError } =
    useImportLists();
  const {
    isPopulated: isQualityProfilesPopulated,
    error: qualityProfilesError,
  } = useQualityProfiles();
  const { isSuccess: isUISettingsPopulated, error: uiSettingsError } =
    useUISettingsQuery();
  const { isPopulated: isLanguagesPopulated, error: languagesError } =
    useLanguages();
  const { isPopulated: isIndexerFlagsPopulated, error: indexerFlagsError } =
    useIndexerFlags();

  const isStatePopulated = useSelector(
    (state: AppState) =>
      state.movies.isPopulated &&
      state.movieCollections.isPopulated &&
      state.customFilters.isPopulated &&
      state.system.status.isPopulated &&
      state.app.translations.isPopulated
  );

  const isPopulated =
    isStatePopulated &&
    isTagsPopulated &&
    isImportListsPopulated &&
    isUISettingsPopulated &&
    isQualityProfilesPopulated &&
    isLanguagesPopulated &&
    isIndexerFlagsPopulated;

  const { hasError: hasStateError, errors: stateErrors } = useSelector(
    createErrorsSelector()
  );

  const hasError =
    hasStateError ||
    !!tagsError ||
    !!importListsError ||
    !!uiSettingsError ||
    !!qualityProfilesError ||
    !!languagesError ||
    !!indexerFlagsError;

  const errors = useMemo(
    () => ({
      ...stateErrors,
      tagsError: tagsError ?? undefined,
      importListsError: importListsError ?? undefined,
      uiSettingsError: uiSettingsError ?? undefined,
      qualityProfilesError: qualityProfilesError ?? undefined,
      languagesError: languagesError ?? undefined,
      indexerFlagsError: indexerFlagsError ?? undefined,
    }),
    [
      stateErrors,
      tagsError,
      importListsError,
      uiSettingsError,
      qualityProfilesError,
      languagesError,
      indexerFlagsError,
    ]
  );

  const isLocalStorageSupported = useMemo(() => {
    const key = 'radarrTest';

    try {
      localStorage.setItem(key, key);
      localStorage.removeItem(key);

      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchMovieCollections());
    dispatch(fetchCustomFilters());
    dispatch(fetchStatus());
    dispatch(fetchTranslations());
  }, [dispatch]);

  return useMemo(() => {
    return { errors, hasError, isLocalStorageSupported, isPopulated };
  }, [errors, hasError, isLocalStorageSupported, isPopulated]);
};

export default useAppPage;
