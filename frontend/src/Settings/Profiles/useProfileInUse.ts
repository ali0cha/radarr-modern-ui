import { useMemo } from 'react';
import { useMovieCollections } from 'Collection/useMovieCollections';
import Movie from 'Movie/Movie';
import { useMovies } from 'Movie/useMovies';
import { useImportLists } from 'Settings/ImportLists/useImportLists';
import ImportList from 'typings/ImportList';
import MovieCollection from 'typings/MovieCollection';

// Whether a movie, a collection or an import list uses the profile
function useProfileInUse(profileProp: string, id?: number) {
  const { movies } = useMovies();
  const { collections } = useMovieCollections();
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
