import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import withDimensions from 'App/withDimensions';
import withMovies from 'Movie/withMovies';
import withToggleMovieMonitored from 'Movie/withToggleMovieMonitored';
import createCollectionExistingMovieSelector from 'Store/Selectors/createCollectionExistingMovieSelector';
import CollectionMovieLabel from './CollectionMovieLabel';

function createMapStateToProps() {
  return createSelector(
    (state, { dimensions }) => dimensions,
    createCollectionExistingMovieSelector(),
    (dimensions, existingMovie) => {
      return {
        isSmallScreen: dimensions.isSmallScreen,
        isExistingMovie: !!existingMovie,
        ...existingMovie
      };
    }
  );
}

class CollectionMovieLabelConnector extends Component {

  //
  // Listeners

  onMonitorTogglePress = (monitored) => {
    this.props.toggleMovieMonitored({
      movieId: this.props.id,
      monitored
    });
  };

  //
  // Render

  render() {
    return (
      <CollectionMovieLabel
        {...this.props}
        onMonitorTogglePress={this.onMonitorTogglePress}
      />
    );
  }
}

CollectionMovieLabelConnector.propTypes = {
  id: PropTypes.number,
  monitored: PropTypes.bool,
  toggleMovieMonitored: PropTypes.func.isRequired
};

export default withDimensions(withMovies(connect(createMapStateToProps)(withToggleMovieMonitored(CollectionMovieLabelConnector))));
