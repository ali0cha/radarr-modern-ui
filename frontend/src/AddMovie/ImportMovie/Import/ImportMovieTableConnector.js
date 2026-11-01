import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAddDefaults } from 'AddMovie/useAddMovie';
import { useMovies } from 'Movie/useMovies';
import { queueLookupMovie, setImportMovieValue, useImportMovieItems } from '../useImportMovie';
import ImportMovieTable from './ImportMovieTable';

function ImportMovieTableConnector(props) {
  const {
    monitor: defaultMonitor,
    qualityProfileId: defaultQualityProfileId,
    minimumAvailability: defaultMinimumAvailability
  } = useAddDefaults();

  const items = useImportMovieItems();
  const { movies: allMovies } = useMovies();
  const dimensions = useSelector((state) => state.app.dimensions);

  const handleMovieLookup = useCallback((name, path, relativePath) => {
    queueLookupMovie({
      name,
      path,
      relativePath,
      term: name
    });
  }, []);

  return (
    <ImportMovieTable
      {...props}
      defaultMonitor={defaultMonitor}
      defaultQualityProfileId={defaultQualityProfileId}
      defaultMinimumAvailability={defaultMinimumAvailability}
      items={items}
      isSmallScreen={dimensions.isSmallScreen}
      allMovies={allMovies}
      onMovieLookup={handleMovieLookup}
      onSetImportMovieValue={setImportMovieValue}
    />
  );
}

export default ImportMovieTableConnector;
