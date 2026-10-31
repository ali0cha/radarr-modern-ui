import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createSelector } from 'reselect';
import { useRootFolder } from 'RootFolder/useRootFolders';
import { setAddMovieDefault } from 'Store/Actions/addMovieActions';
import { clearImportMovie, importMovie, setImportMovieValue } from 'Store/Actions/importMovieActions';
import ImportMovie from './ImportMovie';

function createMapStateToProps() {
  return createSelector(
    (state, { rootFolderIdParam }) => rootFolderIdParam,
    (state, { rootFolder }) => rootFolder,
    (state) => state.addMovie,
    (state) => state.importMovie,
    (state) => state.settings.qualityProfiles,
    (
      rootFolderIdParam,
      rootFolder,
      addMovie,
      importMovieState,
      qualityProfiles
    ) => {
      const rootFolderId = parseInt(rootFolderIdParam);

      const result = {
        rootFolderId,
        qualityProfiles: qualityProfiles.items,
        defaultQualityProfileId: addMovie.defaults.qualityProfileId
      };

      if (rootFolder) {
        return {
          ...result,
          ...rootFolder,
          items: importMovieState.items
        };
      }

      return result;
    }
  );
}

const mapDispatchToProps = {
  dispatchSetImportMovieValue: setImportMovieValue,
  dispatchImportMovie: importMovie,
  dispatchClearImportMovie: clearImportMovie,
  dispatchSetAddMovieDefault: setAddMovieDefault
};

class ImportMovieConnectorBase extends Component {

  //
  // Lifecycle

  componentDidMount() {
    const {
      qualityProfiles,
      defaultQualityProfileId,
      dispatchSetAddMovieDefault
    } = this.props;

    let setDefaults = false;
    const setDefaultPayload = {};

    if (
      !defaultQualityProfileId ||
      !qualityProfiles.some((p) => p.id === defaultQualityProfileId)
    ) {
      setDefaults = true;
      setDefaultPayload.qualityProfileId = qualityProfiles[0].id;
    }

    if (setDefaults) {
      dispatchSetAddMovieDefault(setDefaultPayload);
    }
  }

  componentWillUnmount() {
    this.props.dispatchClearImportMovie();
  }

  //
  // Listeners

  onInputChange = (ids, name, value) => {
    this.props.dispatchSetAddMovieDefault({ [name]: value });

    ids.forEach((id) => {
      this.props.dispatchSetImportMovieValue({
        id,
        [name]: value
      });
    });
  };

  onImportPress = (ids) => {
    this.props.dispatchImportMovie({ ids });
  };

  //
  // Render

  render() {
    return (
      <ImportMovie
        {...this.props}
        onInputChange={this.onInputChange}
        onImportPress={this.onImportPress}
      />
    );
  }
}

ImportMovieConnectorBase.propTypes = {
  rootFolderIdParam: PropTypes.string.isRequired,
  rootFolderId: PropTypes.number.isRequired,
  rootFoldersFetching: PropTypes.bool.isRequired,
  rootFoldersPopulated: PropTypes.bool.isRequired,
  qualityProfiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultQualityProfileId: PropTypes.number.isRequired,
  dispatchSetImportMovieValue: PropTypes.func.isRequired,
  dispatchImportMovie: PropTypes.func.isRequired,
  dispatchClearImportMovie: PropTypes.func.isRequired,
  dispatchSetAddMovieDefault: PropTypes.func.isRequired
};

const ConnectedImportMovie = connect(createMapStateToProps, mapDispatchToProps)(ImportMovieConnectorBase);

function ImportMovieConnector() {
  const { rootFolderId } = useParams();
  const { data: rootFolder, isFetching, isSuccess, error } = useRootFolder(parseInt(rootFolderId));

  return (
    <ConnectedImportMovie
      rootFolderIdParam={rootFolderId}
      rootFolder={rootFolder}
      rootFoldersFetching={isFetching}
      rootFoldersPopulated={isSuccess}
      rootFoldersError={error ?? undefined}
    />
  );
}

export default ImportMovieConnector;
