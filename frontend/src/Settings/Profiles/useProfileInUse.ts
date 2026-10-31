import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import AppState from 'App/State/AppState';
import Movie from 'Movie/Movie';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import createAllMoviesSelector from 'Store/Selectors/createAllMoviesSelector';
import ImportList from 'typings/ImportList';
import MovieCollection from 'typings/MovieCollection';

// Whether a movie, a collection or an import list uses the profile
function useProfileInUse(profileProp: string, id?: number) {
  const movies = useSelector(createAllMoviesSelector());
  const collections = useSelector(
    (state: AppState) => state.movieCollections.items
  );
  const { items: importLists } = useImportLists();

  return useMemo(() => {
    if (!id) {
      return false;
    }

    return (
      movies.some((m) => m[profileProp as keyof Movie] === id) ||
      importLists.some(
        (list) => list[profileProp as keyof ImportList] === id
      ) ||
      collections.some(
        (collection) => collection[profileProp as keyof MovieCollection] === id
      )
    );
  }, [profileProp, id, movies, importLists, collections]);
}

export default useProfileInUse;
