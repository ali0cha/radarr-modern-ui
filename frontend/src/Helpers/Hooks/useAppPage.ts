import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import AppState from 'App/State/AppState';
import { useMovieCollections } from 'Collection/useMovieCollections';
import { useCustomFilters } from 'Components/Filter/useCustomFilters';
import { useInitializeLanguage } from 'Language/useLanguageName';
import { useLanguages } from 'Language/useLanguages';
import { useMovies } from 'Movie/useMovies';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import { useIndexerFlags } from 'Settings/Indexers/useIndexerFlags';
import { useQualityProfiles } from 'Settings/Profiles/Quality/useQualityProfiles';
import { useUISettingsQuery } from 'Settings/UI/useUISettings';
import { fetchTranslations } from 'Store/Actions/appActions';
import { fetchStatus } from 'Store/Actions/systemActions';
import { useTagsQuery } from 'Tags/useTags';

const createErrorsSelector = () =>
  createSelector(
    (state: AppState) => state.system.status.error,
    (state: AppState) => state.app.translations.error,
    (systemStatusError, translationsError) => {
      const hasError = !!(systemStatusError || translationsError);

      return {
        hasError,
        errors: {
          systemStatusError,
          translationsError,
        },
      };
    }
  );

const useAppPage = () => {
  const dispatch = useDispatch();

  useInitializeLanguage();

  const { isPopulated: isMoviesPopulated, error: moviesError } = useMovies();
  const { isPopulated: isCollectionsPopulated, error: movieCollectionsError } =
    useMovieCollections();
  const { isPopulated: isCustomFiltersPopulated, error: customFiltersError } =
    useCustomFilters();
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
      state.system.status.isPopulated && state.app.translations.isPopulated
  );

  const isPopulated =
    isStatePopulated &&
    isCustomFiltersPopulated &&
    isMoviesPopulated &&
    isCollectionsPopulated &&
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
    !!customFiltersError ||
    !!moviesError ||
    !!movieCollectionsError ||
    !!tagsError ||
    !!importListsError ||
    !!uiSettingsError ||
    !!qualityProfilesError ||
    !!languagesError ||
    !!indexerFlagsError;

  const errors = useMemo(
    () => ({
      ...stateErrors,
      customFiltersError: customFiltersError ?? undefined,
      moviesError: moviesError ?? undefined,
      movieCollectionsError: movieCollectionsError ?? undefined,
      tagsError: tagsError ?? undefined,
      importListsError: importListsError ?? undefined,
      uiSettingsError: uiSettingsError ?? undefined,
      qualityProfilesError: qualityProfilesError ?? undefined,
      languagesError: languagesError ?? undefined,
      indexerFlagsError: indexerFlagsError ?? undefined,
    }),
    [
      stateErrors,
      customFiltersError,
      moviesError,
      movieCollectionsError,
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
    dispatch(fetchStatus());
    dispatch(fetchTranslations());
  }, [dispatch]);

  return useMemo(() => {
    return { errors, hasError, isLocalStorageSupported, isPopulated };
  }, [errors, hasError, isLocalStorageSupported, isPopulated]);
};

export default useAppPage;
