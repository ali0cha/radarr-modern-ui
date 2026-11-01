import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { queryClient } from 'App/queryClient';
import Command from 'Commands/Command';
import useApiQuery, {
  fetchApi,
  getApiPath,
  getApiQueryKey,
  invalidateApiQueries,
} from 'Helpers/Hooks/useApiQuery';
import {
  findCommand,
  isCommandExecuting,
  isSameCommand,
} from 'Utilities/Command';

export const COMMANDS_PATH = '/command';

// The commands are kept up to date by SignalR
const commandsQueryOptions = {
  retry: false,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
};

const NO_COMMANDS: Command[] = [];

export function useCommands() {
  const { data, isFetching, isSuccess, error, refetch } = useApiQuery<
    Command[]
  >({
    path: COMMANDS_PATH,
    queryOptions: commandsQueryOptions,
  });

  return {
    commands: data ?? NO_COMMANDS,
    isFetching,
    isPopulated: isSuccess,
    error,
    refetch,
  };
}

// The last command that matches, and whether it is running
export function useCommand(name: string, constraints = {}) {
  const { commands } = useCommands();

  return useMemo(
    () =>
      findCommand(commands, { name, ...constraints }) as Command | undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [commands, name, JSON.stringify(constraints)]
  );
}

export function useCommandExecuting(name: string, constraints = {}) {
  return isCommandExecuting(useCommand(name, constraints));
}

export function useExecutingCommands() {
  const { commands } = useCommands();

  return useMemo(
    () => commands.filter((command) => isCommandExecuting(command)),
    [commands]
  );
}

export function setCommand(client: QueryClient, command: Command) {
  client.setQueriesData<Command[]>(
    { queryKey: getApiQueryKey(COMMANDS_PATH) },
    (commands) => {
      if (!commands) {
        return commands;
      }

      return commands.some(({ id }) => id === command.id)
        ? commands.map((item) =>
            item.id === command.id ? { ...item, ...command } : item
          )
        : [...commands, command];
    }
  );
}

export function removeCommand(client: QueryClient, id: number) {
  client.setQueriesData<Command[]>(
    { queryKey: getApiQueryKey(COMMANDS_PATH) },
    (commands) => commands?.filter((command) => command.id !== id)
  );
}

export function invalidateCommands(client: QueryClient) {
  return invalidateApiQueries(client, COMMANDS_PATH);
}

export function useInvalidateCommands() {
  const client = useQueryClient();

  return useCallback(() => invalidateCommands(client), [client]);
}

const commandFinishedCallbacks: Record<number, (command: Command) => void> = {};

// Called when the command that was started is finished (by SignalR)
export function callCommandFinished(command: Command) {
  const commandFinished = commandFinishedCallbacks[command.id];

  if (commandFinished) {
    commandFinished(command);
  }

  delete commandFinishedCallbacks[command.id];
}

let lastCommand: object | null = null;
let lastCommandTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

export interface ExecuteCommandPayload {
  name: string;
  commandFinished?: (command: Command) => void;
  [key: string]: unknown;
}

// Starts a command: the server queues it, and tells how it goes by SignalR
export function executeCommand(payload: ExecuteCommandPayload) {
  if (lastCommand && isSameCommand(lastCommand, payload)) {
    console.warn(
      'Please wait at least 5 seconds before running this command again'
    );
  }

  lastCommand = payload;

  clearTimeout(lastCommandTimeout);

  lastCommandTimeout = setTimeout(() => {
    lastCommand = null;
  }, 5000);

  const { commandFinished, ...requestPayload } = payload;

  return fetchApi<Command>(getApiPath(COMMANDS_PATH), {
    method: 'POST',
    headers: {
      'X-Api-Key': window.Radarr.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload),
  }).then((command) => {
    if (commandFinished) {
      commandFinishedCallbacks[command.id] = commandFinished;
    }

    setCommand(queryClient, command);

    return command;
  });
}

export function cancelCommand(id: number) {
  return fetchApi<unknown>(getApiPath(`${COMMANDS_PATH}/${id}`), {
    method: 'DELETE',
    headers: { 'X-Api-Key': window.Radarr.apiKey },
  }).then(() => removeCommand(queryClient, id));
}
