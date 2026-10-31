import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as commandNames from 'Commands/commandNames';
import withScrollPosition from 'Components/withScrollPosition';
import { usePrefetchRootFolders } from 'RootFolder/useRootFolders';
import { executeCommand } from 'Store/Actions/commandActions';
import { addImportListExclusions, addMovies, clearAddMovie, fetchDiscoverMovies, setListMovieFilter, setListMovieSort, setListMovieTableOption, setListMovieView } from 'Store/Actions/discoverMovieActions';
import scrollPositions from 'Store/scrollPositions';
import createCommandExecutingSelector from 'Store/Selectors/createCommandExecutingSelector';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import createDiscoverMovieClientSideCollectionItemsSelector from 'Store/Selectors/createDiscoverMovieClientSideCollectionItemsSelector';
import { registerPagePopulator, unregisterPagePopulator } from 'Utilities/pagePopulator';
import DiscoverMovie from './DiscoverMovie';

function createMapStateToProps() {
  return createSelector(
    (state) => state.discoverMovie,
    createDiscoverMovieClientSideCollectionItemsSelector('discoverMovie'),
    createCommandExecutingSelector(commandNames.IMPORT_LIST_SYNC),
    createDimensionsSelector(),
    (
      discoverMovie,
      movies,
      isSyncingLists,
      dimensionsState
    ) => {
      return {
        ...discoverMovie.options,
        ...movies,
        isSyncingLists,
        isSmallScreen: dimensionsState.isSmallScreen
      };
    }
  );
}

function createMapDispatchToProps(dispatch, props) {
  return {
    dispatchClearListMovie() {
      dispatch(clearAddMovie());
    },

    dispatchFetchListMovies() {
      dispatch(fetchDiscoverMovies());
    },

    onTableOptionChange(payload) {
      dispatch(setListMovieTableOption(payload));
    },

    onSortSelect(sortKey) {
      dispatch(setListMovieSort({ sortKey }));
    },

    onFilterSelect(selectedFilterKey) {
      dispatch(setListMovieFilter({ selectedFilterKey }));
    },

    dispatchSetListMovieView(view) {
      dispatch(setListMovieView({ view }));
    },

    dispatchAddMovies(ids, addOptions) {
      dispatch(addMovies({ ids, addOptions }));
    },

    dispatchAddImportListExclusions(exclusions) {
      dispatch(addImportListExclusions(exclusions));
    },

    onImportListSyncPress() {
      dispatch(executeCommand({
        name: commandNames.IMPORT_LIST_SYNC,
        commandFinished: this.dispatchFetchListMovies
      }));
    }
  };
}

class DiscoverMovieConnectorBase extends Component {

  //
  // Lifecycle

  componentDidMount() {
    registerPagePopulator(this.repopulate);
    this.props.dispatchFetchListMovies();
  }

  componentWillUnmount() {
    this.props.dispatchClearListMovie();
    unregisterPagePopulator(this.repopulate);
  }

  //
  // Listeners

  onViewSelect = (view) => {
    this.props.dispatchSetListMovieView(view);
  };

  onScroll = ({ scrollTop }) => {
    scrollPositions.discoverMovie = scrollTop;
  };

  onAddMoviesPress = ({ ids, addOptions }) => {
    this.props.dispatchAddMovies(ids, addOptions);
  };

  onExcludeMoviesPress =({ ids }) => {
    this.props.dispatchAddImportListExclusions({ ids });
  };

  //
  // Render

  render() {
    return (
      <DiscoverMovie
        {...this.props}
        onViewSelect={this.onViewSelect}
        onScroll={this.onScroll}
        onAddMoviesPress={this.onAddMoviesPress}
        onExcludeMoviesPress={this.onExcludeMoviesPress}
        onSyncListsPress={this.onSyncListsPress}
      />
    );
  }
}

DiscoverMovieConnectorBase.propTypes = {
  isSmallScreen: PropTypes.bool.isRequired,
  view: PropTypes.string.isRequired,
  dispatchFetchListMovies: PropTypes.func.isRequired,
  dispatchClearListMovie: PropTypes.func.isRequired,
  dispatchSetListMovieView: PropTypes.func.isRequired,
  dispatchAddMovies: PropTypes.func.isRequired,
  dispatchAddImportListExclusions: PropTypes.func.isRequired
};

const ConnectedDiscoverMovie = withScrollPosition(
  connect(createMapStateToProps, createMapDispatchToProps)(DiscoverMovieConnectorBase),
  'discoverMovie'
);

function DiscoverMovieConnector(props) {
  usePrefetchRootFolders();

  return <ConnectedDiscoverMovie {...props} />;
}

export default DiscoverMovieConnector;
