import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSelector } from 'reselect';
import { addRootFolder, deleteRootFolder, fetchRootFolders } from 'Store/Actions/rootFolderActions';
import createRootFoldersSelector from 'Store/Selectors/createRootFoldersSelector';
import createSystemStatusSelector from 'Store/Selectors/createSystemStatusSelector';
import ImportMovieSelectFolder from './ImportMovieSelectFolder';

function createMapStateToProps() {
  return createSelector(
    createRootFoldersSelector(),
    createSystemStatusSelector(),
    (rootFolders, systemStatus) => {
      return {
        ...rootFolders,
        isWindows: systemStatus.isWindows
      };
    }
  );
}

const mapDispatchToProps = {
  fetchRootFolders,
  addRootFolder,
  deleteRootFolder
};

class ImportMovieSelectFolderConnectorBase extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchRootFolders();
  }

  componentDidUpdate(prevProps) {
    const {
      items,
      isSaving,
      saveError
    } = this.props;

    if (prevProps.isSaving && !isSaving && !saveError) {
      const newRootFolders = _.differenceBy(items, prevProps.items, (item) => item.id);

      if (newRootFolders.length === 1) {
        this.props.navigate(`/add/import/${newRootFolders[0].id}`);
      }
    }
  }

  //
  // Listeners

  onNewRootFolderSelect = (path) => {
    this.props.addRootFolder({ path });
  };

  onDeleteRootFolderPress = (id) => {
    this.props.deleteRootFolder({ id });
  };

  //
  // Render

  render() {
    return (
      <ImportMovieSelectFolder
        {...this.props}
        onNewRootFolderSelect={this.onNewRootFolderSelect}
        onDeleteRootFolderPress={this.onDeleteRootFolderPress}
      />
    );
  }
}

ImportMovieSelectFolderConnectorBase.propTypes = {
  isSaving: PropTypes.bool.isRequired,
  saveError: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchRootFolders: PropTypes.func.isRequired,
  addRootFolder: PropTypes.func.isRequired,
  deleteRootFolder: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
};

const ConnectedImportMovieSelectFolder = connect(createMapStateToProps, mapDispatchToProps)(ImportMovieSelectFolderConnectorBase);

function ImportMovieSelectFolderConnector() {
  const navigate = useNavigate();

  return <ConnectedImportMovieSelectFolder navigate={navigate} />;
}

export default ImportMovieSelectFolderConnector;
