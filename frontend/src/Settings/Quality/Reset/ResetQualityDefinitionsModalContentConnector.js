import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import * as commandNames from 'Commands/commandNames';
import { executeCommand } from 'Commands/useCommands';
import withCommandExecuting from 'Commands/withCommandExecuting';
import ResetQualityDefinitionsModalContent from './ResetQualityDefinitionsModalContent';

function ResetQualityDefinitionsModalContentConnector(props) {
  const { isCommandExecuting, onModalClose } = props;

  const handleResetQualityDefinitions = useCallback((resetTitles) => {
    executeCommand({ name: commandNames.RESET_QUALITY_DEFINITIONS, resetTitles });
    onModalClose(true);
  }, [onModalClose]);

  return (
    <ResetQualityDefinitionsModalContent
      {...props}
      isResettingQualityDefinitions={isCommandExecuting}
      onResetQualityDefinitions={handleResetQualityDefinitions}
    />
  );
}

ResetQualityDefinitionsModalContentConnector.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  isCommandExecuting: PropTypes.bool.isRequired
};

export default withCommandExecuting(commandNames.RESET_QUALITY_DEFINITIONS)(ResetQualityDefinitionsModalContentConnector);
