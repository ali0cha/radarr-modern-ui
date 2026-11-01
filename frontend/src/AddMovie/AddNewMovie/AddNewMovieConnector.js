import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createSelector } from 'reselect';
import withMovies from 'Movie/withMovies';
import { usePrefetchRootFolders } from 'RootFolder/useRootFolders';
import { clearAddMovie, lookupMovie } from 'Store/Actions/addMovieActions';
import parseUrl from 'Utilities/String/parseUrl';
import AddNewMovie from './AddNewMovie';

function createMapStateToProps() {
  return createSelector(
    (state) => state.addMovie,
    (state, { allMovies }) => allMovies.length,
    (state, { locationSearch }) => locationSearch,
    (addMovie, existingMoviesCount, locationSearch) => {
      const { params } = parseUrl(locationSearch);

      return {
        ...addMovie,
        term: params.term,
        hasExistingMovies: existingMoviesCount > 0
      };
    }
  );
}

const mapDispatchToProps = {
  lookupMovie,
  clearAddMovie
};

class AddNewMovieConnectorBase extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._movieLookupTimeout = null;
  }

  componentWillUnmount() {
    if (this._movieLookupTimeout) {
      clearTimeout(this._movieLookupTimeout);
    }

    this.props.clearAddMovie();
  }

  //
  // Listeners

  onMovieLookupChange = (term) => {
    if (this._movieLookupTimeout) {
      clearTimeout(this._movieLookupTimeout);
    }

    if (term.trim() === '') {
      this.props.clearAddMovie();
    } else {
      this._movieLookupTimeout = setTimeout(() => {
        this.props.lookupMovie({ term });
      }, 300);
    }
  };

  onClearMovieLookup = () => {
    this.props.clearAddMovie();
  };

  //
  // Render

  render() {
    const {
      term,
      ...otherProps
    } = this.props;

    return (
      <AddNewMovie
        term={term}
        {...otherProps}
        onMovieLookupChange={this.onMovieLookupChange}
        onClearMovieLookup={this.onClearMovieLookup}
      />
    );
  }
}

AddNewMovieConnectorBase.propTypes = {
  term: PropTypes.string,
  locationSearch: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  lookupMovie: PropTypes.func.isRequired,
  clearAddMovie: PropTypes.func.isRequired
};

const ConnectedAddNewMovie = withMovies(connect(createMapStateToProps, mapDispatchToProps)(AddNewMovieConnectorBase));

function AddNewMovieConnector() {
  const { search } = useLocation();

  usePrefetchRootFolders();

  return <ConnectedAddNewMovie locationSearch={search} />;
}

export default AddNewMovieConnector;
