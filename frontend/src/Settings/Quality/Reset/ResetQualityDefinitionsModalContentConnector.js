import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as commandNames from 'Commands/commandNames';
import { executeCommand } from 'Commands/useCommands';
import withCommandExecuting from 'Commands/withCommandExecuting';
import ResetQualityDefinitionsModalContent from './ResetQualityDefinitionsModalContent';

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

class ResetQualityDefinitionsModalContentConnector extends Component {

  //
  // Listeners

  onResetQualityDefinitions = (resetTitles) => {
    executeCommand({ name: commandNames.RESET_QUALITY_DEFINITIONS, resetTitles });
    this.props.onModalClose(true);
  };

  //
  // Render

  render() {
    return (
      <ResetQualityDefinitionsModalContent
        {...this.props}
        onResetQualityDefinitions={this.onResetQualityDefinitions}
      />
    );
  }
}

ResetQualityDefinitionsModalContentConnector.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  isResettingQualityDefinitions: PropTypes.bool.isRequired
};

export default withCommandExecuting(commandNames.RESET_QUALITY_DEFINITIONS)(connect(createMapStateToProps)(ResetQualityDefinitionsModalContentConnector));
