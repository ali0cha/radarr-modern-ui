import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as commandNames from 'Commands/commandNames';
import withCommandExecuting from 'Commands/withCommandExecuting';
import Quality from './Quality';

function createMapStateToProps() {
  return createSelector(
    (state, { isCommandExecuting }) => isCommandExecuting,
    (isResettingQualityDefinitions) => {
      return {
        isResettingQualityDefinitions
      };
    }
  );
}

class QualityConnector extends Component {

  //
  // Render

  render() {
    return (
      <Quality
        {...this.props}
      />
    );
  }
}

QualityConnector.propTypes = {
  isResettingQualityDefinitions: PropTypes.bool.isRequired
};

export default withCommandExecuting(commandNames.RESET_QUALITY_DEFINITIONS)(connect(createMapStateToProps)(QualityConnector));
