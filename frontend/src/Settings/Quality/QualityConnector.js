import PropTypes from 'prop-types';
import React from 'react';
import * as commandNames from 'Commands/commandNames';
import withCommandExecuting from 'Commands/withCommandExecuting';
import Quality from './Quality';

function QualityConnector({ isCommandExecuting, ...otherProps }) {
  return (
    <Quality
      {...otherProps}
      isCommandExecuting={isCommandExecuting}
      isResettingQualityDefinitions={isCommandExecuting}
    />
  );
}

QualityConnector.propTypes = {
  isCommandExecuting: PropTypes.bool.isRequired
};

export default withCommandExecuting(commandNames.RESET_QUALITY_DEFINITIONS)(QualityConnector);
