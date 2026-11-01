import { queryClient } from 'App/queryClient';
import Command from 'Commands/Command';
import { messageTypes } from 'Helpers/Props';
import { callCommandFinished, removeCommand, setCommand } from './useCommands';

interface MessageActions {
  showMessage: (message: unknown) => void;
  hideMessage: (message: { id: number }) => void;
}

const removeCommandTimeoutIds: Record<
  number,
  ReturnType<typeof setTimeout>
> = {};

// What the server says about a command is shown as a message, when it asks to
function showCommandMessage(command: Command, { showMessage }: MessageActions) {
  const { id, name, trigger, message, body, status } = command;

  if (!message || !body || !body.sendUpdatesToClient || body.suppressMessages) {
    return;
  }

  let type: string = messageTypes.INFO;
  let hideAfter = 0;

  if (status === 'completed') {
    type = messageTypes.SUCCESS;
    hideAfter = 4;
  } else if (status === 'failed') {
    type = messageTypes.ERROR;
    hideAfter = trigger === 'manual' ? 10 : 4;
  }

  showMessage({ id, name, message, type, hideAfter });
}

// A command that is over is forgotten after a while
function scheduleRemoveCommand(command: Command, actions: MessageActions) {
  const { id, status } = command;

  if (status === 'queued') {
    return;
  }

  clearTimeout(removeCommandTimeoutIds[id]);

  removeCommandTimeoutIds[id] = setTimeout(() => {
    removeCommand(queryClient, id);
    actions.hideMessage({ id });

    delete removeCommandTimeoutIds[id];
  }, 60000 * 5);
}

export function handleCommandUpdated(
  command: Command,
  actions: MessageActions
) {
  setCommand(queryClient, command);

  showCommandMessage(command, actions);
  scheduleRemoveCommand(command, actions);
}

export function handleCommandFinished(
  command: Command,
  actions: MessageActions
) {
  callCommandFinished(command);

  setCommand(queryClient, command);

  scheduleRemoveCommand(command, actions);
  showCommandMessage(command, actions);
}
