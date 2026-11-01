import PropTypes from 'prop-types';
import React, { Component, useMemo } from 'react';
import withLanguages from 'Language/withLanguages';
import { useMovieFile, useUpdateMovieFiles } from 'MovieFile/useMovieFiles';
import withQualityProfileSchema from 'Settings/Profiles/Quality/withQualityProfileSchema';
import getQualities from 'Utilities/Quality/getQualities';
import FileEditModalContent from './FileEditModalContent';

class FileEditModalContentConnector extends Component {

  //
  // Listeners

  onSaveInputs = ( payload ) => {
    const {
      qualityId,
      real,
      proper,
      languageIds,
      edition,
      releaseGroup,
      indexerFlags
    } = payload;

    const quality = this.props.qualities.find((item) => item.id === qualityId);

    const languages = [];

    languageIds.forEach((languageId) => {
      const language = this.props.languages.find((item) => item.id === parseInt(languageId));

      if (language !== undefined) {
        languages.push(language);
      }
    });

    const revision = {
      version: proper ? 2 : 1,
      real: real ? 1 : 0
    };

    this.props.dispatchUpdateMovieFiles({
      files: [{
        id: this.props.movieFileId,
        languages,
        indexerFlags,
        edition,
        releaseGroup,
        quality: {
          quality,
          revision
        }
      }]
    });

    this.props.onModalClose(true);
  };

  //
  // Render

  render() {
    return (
      <FileEditModalContent
        {...this.props}
        onSaveInputs={this.onSaveInputs}
      />
    );
  }
}

FileEditModalContentConnector.propTypes = {
  movieFileId: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  qualities: PropTypes.arrayOf(PropTypes.object).isRequired,
  languages: PropTypes.arrayOf(PropTypes.object).isRequired,
  languageIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  indexerFlags: PropTypes.number.isRequired,
  qualityId: PropTypes.number.isRequired,
  real: PropTypes.bool.isRequired,
  edition: PropTypes.string.isRequired,
  releaseGroup: PropTypes.string.isRequired,
  relativePath: PropTypes.string.isRequired,
  proper: PropTypes.bool.isRequired,
  dispatchUpdateMovieFiles: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

function FileEditModalContentConnectorWithData(props) {
  const {
    movieFileId,
    languagesState,
    qualityProfileSchemaState,
    onModalClose
  } = props;

  const savedMovieFile = useMovieFile(movieFileId);
  const { updateMovieFiles } = useUpdateMovieFiles();

  const mapped = useMemo(() => {
    const movieFile = savedMovieFile ?? {};
    const filterItems = ['Any', 'Original'];
    const filteredLanguages = languagesState.items.filter((lang) => !filterItems.includes(lang.name));
    const quality = movieFile.quality;

    return {
      isFetching: qualityProfileSchemaState.isFetching || languagesState.isFetching,
      isPopulated: qualityProfileSchemaState.isPopulated && languagesState.isPopulated,
      error: qualityProfileSchemaState.error || languagesState.error,
      qualityId: quality ? quality.quality.id : 0,
      real: quality ? quality.revision.real > 0 : false,
      proper: quality ? quality.revision.version > 1 : false,
      qualities: getQualities(qualityProfileSchemaState.schema?.items),
      languageIds: movieFile.languages ? movieFile.languages.map((l) => l.id) : [],
      languages: filteredLanguages,
      indexerFlags: movieFile.indexerFlags,
      edition: movieFile.edition,
      releaseGroup: movieFile.releaseGroup,
      relativePath: movieFile.relativePath
    };
  }, [savedMovieFile, languagesState, qualityProfileSchemaState]);

  return (
    <FileEditModalContentConnector
      movieFileId={movieFileId}
      {...mapped}
      dispatchUpdateMovieFiles={({ files }) => updateMovieFiles(files)}
      onModalClose={onModalClose}
    />
  );
}

FileEditModalContentConnectorWithData.propTypes = {
  movieFileId: PropTypes.number.isRequired,
  languagesState: PropTypes.object.isRequired,
  qualityProfileSchemaState: PropTypes.object.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default withQualityProfileSchema(withLanguages(FileEditModalContentConnectorWithData));
