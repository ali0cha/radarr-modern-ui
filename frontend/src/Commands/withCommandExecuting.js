import React from 'react';
import { useCommandExecuting } from 'Commands/useCommands';

// For the connected components that have not been converted to hooks yet: the
// property tells whether the command is running.
function withCommandExecuting(commandName, propName = 'isCommandExecuting') {
  return function(WrappedComponent) {
    function WithCommandExecuting(props) {
      const isExecuting = useCommandExecuting(commandName);

      return (
        <WrappedComponent
          {...props}
          {...{ [propName]: isExecuting }}
        />
      );
    }

    return WithCommandExecuting;
  };
}

export default withCommandExecuting;
