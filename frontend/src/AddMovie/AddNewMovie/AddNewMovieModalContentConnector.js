import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import selectSettings from 'Store/Selectors/selectSettings';
import useIsWindows from 'System/useIsWindows';
import { setAddDefaults, useAddDefaults, useAddMovie } from '../useAddMovie';
import AddNewMovieModalContent from './AddNewMovieModalContent';

function AddNewMovieModalContentConnector(props) {
  const { tmdbId } = props;

  const defaults = useAddDefaults();
  const { isSmallScreen } = useSelector(createDimensionsSelector());
  const isWindows = useIsWindows();
  const { addMovie, isAdding, addError } = useAddMovie();

  const {
    settings,
    validationErrors,
    validationWarnings
  } = useMemo(() => selectSettings(defaults, {}, addError), [defaults, addError]);

  const handleInputChange = useCallback(({ name, value }) => {
    setAddDefaults({ [name]: value });
  }, []);

  const handleAddMoviePress = useCallback(() => {
    addMovie({
      tmdbId,
      rootFolderPath: settings.rootFolderPath.value,
      monitor: settings.monitor.value,
      qualityProfileId: settings.qualityProfileId.value,
      minimumAvailability: settings.minimumAvailability.value,
      searchForMovie: settings.searchForMovie.value,
      tags: settings.tags.value
    });
  }, [tmdbId, settings, addMovie]);

  return (
    <AddNewMovieModalContent
      {...props}
      {...settings}
      isAdding={isAdding}
      addError={addError}
      isSmallScreen={isSmallScreen}
      validationErrors={validationErrors}
      validationWarnings={validationWarnings}
      isWindows={isWindows}
      onInputChange={handleInputChange}
      onAddMoviePress={handleAddMoviePress}
    />
  );
}

AddNewMovieModalContentConnector.propTypes = {
  tmdbId: PropTypes.number.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default AddNewMovieModalContentConnector;
