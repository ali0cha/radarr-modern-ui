import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { mergeColumns } from 'Components/Table/pagedTable';
import withLanguages from 'Language/withLanguages';
import {
  movieFilesTableStore,
  useDeleteMovieFile,
  useMovieFilesForMovie
} from 'MovieFile/useMovieFiles';
import withQualityProfileSchema from 'Settings/Profiles/Quality/withQualityProfileSchema';
import { sortItems } from 'Store/Selectors/createClientSideCollectionSelector';
import getQualities from 'Utilities/Quality/getQualities';
import { movieFileColumns } from './movieFileColumns';
import MovieFileEditorTableContent from './MovieFileEditorTableContent';

function MovieFileEditorTableContentConnector(props) {
  const {
    movieId,
    languagesState,
    qualityProfileSchemaState
  } = props;

  const { items } = useMovieFilesForMovie(movieId);
  const { deleteMovieFile, isDeleting } = useDeleteMovieFile();

  const sortKey = movieFilesTableStore((state) => state.sortKey);
  const sortDirection = movieFilesTableStore((state) => state.sortDirection);
  const storedColumns = movieFilesTableStore((state) => state.columns);
  const setSort = movieFilesTableStore((state) => state.setSort);
  const setColumns = movieFilesTableStore((state) => state.setColumns);

  const columns = useMemo(() => {
    return mergeColumns(movieFileColumns, storedColumns);
  }, [storedColumns]);

  const sortedItems = useMemo(() => {
    return sortItems(items.filter((file) => file.movieId === movieId), { sortKey, sortDirection });
  }, [items, movieId, sortKey, sortDirection]);

  const qualities = useMemo(() => {
    return getQualities(qualityProfileSchemaState.schema?.items);
  }, [qualityProfileSchemaState]);

  const handleTableOptionChange = useCallback((payload) => {
    if (payload.columns) {
      setColumns(payload.columns);
    }
  }, [setColumns]);

  return (
    <MovieFileEditorTableContent
      items={sortedItems}
      columns={columns}
      sortKey={sortKey}
      sortDirection={sortDirection}
      isDeleting={isDeleting}
      isSaving={false}
      error={null}
      languages={languagesState.items}
      qualities={qualities}
      onDeletePress={deleteMovieFile}
      onTableOptionChange={handleTableOptionChange}
      onSortPress={setSort}
    />
  );
}

MovieFileEditorTableContentConnector.propTypes = {
  movieId: PropTypes.number.isRequired,
  languagesState: PropTypes.object.isRequired,
  qualityProfileSchemaState: PropTypes.object.isRequired
};

export default withQualityProfileSchema(withLanguages(MovieFileEditorTableContentConnector));
