import { useEffect, useMemo } from 'react';
import { fetchTranslations, useAppStore } from 'App/useAppStore';
import { useMovieCollections } from 'Collection/useMovieCollections';
import { useCustomFilters } from 'Components/Filter/useCustomFilters';
import { useInitializeLanguage } from 'Language/useLanguageName';
import { useLanguages } from 'Language/useLanguages';
import { useMovies } from 'Movie/useMovies';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import { useIndexerFlags } from 'Settings/Indexers/useIndexerFlags';
import { useQualityProfiles } from 'Settings/Profiles/Quality/useQualityProfiles';
import { useUISettingsQuery } from 'Settings/UI/useUISettings';
import { useSystemStatusQuery } from 'System/useSystemStatus';
import { useTagsQuery } from 'Tags/useTags';

const useAppPage = () => {
  useInitializeLanguage();

  const { isPopulated: isMoviesPopulated, error: moviesError } = useMovies();
  const { isPopulated: isCollectionsPopulated, error: movieCollectionsError } =
    useMovieCollections();
  const { isPopulated: isCustomFiltersPopulated, error: customFiltersError } =
    useCustomFilters();
  const { isPopulated: isSystemStatusPopulated, error: systemStatusError } =
    useSystemStatusQuery();
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

  const { isPopulated: isTranslationsPopulated, error: translationsError } =
    useAppStore((state) => state.translations);

  const isPopulated =
    isTranslationsPopulated &&
    isSystemStatusPopulated &&
    isCustomFiltersPopulated &&
    isMoviesPopulated &&
    isCollectionsPopulated &&
    isTagsPopulated &&
    isImportListsPopulated &&
    isUISettingsPopulated &&
    isQualityProfilesPopulated &&
    isLanguagesPopulated &&
    isIndexerFlagsPopulated;

  const hasError =
    !!translationsError ||
    !!systemStatusError ||
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
      translationsError: translationsError ?? undefined,
      systemStatusError: systemStatusError ?? undefined,
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
      translationsError,
      systemStatusError,
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
    fetchTranslations();
  }, []);

  return useMemo(() => {
    return { errors, hasError, isLocalStorageSupported, isPopulated };
  }, [errors, hasError, isLocalStorageSupported, isPopulated]);
};

export default useAppPage;
