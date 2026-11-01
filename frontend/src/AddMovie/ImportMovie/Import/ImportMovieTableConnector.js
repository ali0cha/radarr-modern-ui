import React, { useCallback } from 'react';
import { useAddDefaults } from 'AddMovie/useAddMovie';
import { useDimensions } from 'App/useAppStore';
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
  const dimensions = useDimensions();

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
