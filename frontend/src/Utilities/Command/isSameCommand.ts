import _ from 'lodash';
import { CommandBody } from 'Commands/Command';

function isSameCommand(
  commandA: Partial<CommandBody> & Pick<CommandBody, 'name'>,
  commandB: Partial<CommandBody> & Pick<CommandBody, 'name'>
) {
  if (commandA.name.toLocaleLowerCase() !== commandB.name.toLocaleLowerCase()) {
    return false;
  }

  for (const key in commandB) {
    if (key !== 'name') {
      const value = commandB[key as keyof CommandBody];
      const otherValue = commandA[key as keyof CommandBody];

      if (Array.isArray(value)) {
        if (_.difference(value, otherValue as unknown[]).length > 0) {
          return false;
        }
      } else if (value !== otherValue) {
        return false;
      }
    }
  }

  return true;
}

export default isSameCommand;
