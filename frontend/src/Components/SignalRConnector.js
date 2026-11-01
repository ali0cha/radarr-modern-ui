import * as signalR from '@microsoft/signalr/dist/browser/signalr.js';
import { Component } from 'react';
import {
  invalidateQueue,
  invalidateQueueDetails,
  invalidateQueuePages,
  setQueueStatus
} from 'Activity/Queue/useQueue';
import { queryClient } from 'App/queryClient';
import { hideMessage, setAppValue, setVersion, showMessage } from 'App/useAppStore';
import { updateCalendarItem } from 'Calendar/useCalendar';
import { invalidateMovieCollections, removeMovieCollection, setMovieCollection } from 'Collection/useMovieCollections';
import { handleCommandFinished, handleCommandUpdated } from 'Commands/commandEvents';
import { invalidateCommands } from 'Commands/useCommands';
import { invalidateApiQueries } from 'Helpers/Hooks/useApiQuery';
import { invalidateMovies, removeMovies, setMovie } from 'Movie/useMovies';
import { invalidateMovieFiles, removeMovieFiles, updateMovieFile } from 'MovieFile/useMovieFiles';
import { invalidateRootFolders } from 'RootFolder/useRootFolders';
import { DOWNLOAD_CLIENTS_PATH } from 'Settings/DownloadClients/useDownloadClients';
import { IMPORT_LISTS_PATH } from 'Settings/ImportLists/useImportLists';
import { INDEXERS_PATH } from 'Settings/Indexers/useIndexers';
import { METADATA_PATH } from 'Settings/Metadata/Metadata/useMetadata';
import { NOTIFICATIONS_PATH } from 'Settings/Notifications/useNotifications';
import { QUALITY_DEFINITIONS_PATH } from 'Settings/Quality/Definition/useQualityDefinitions';
import { invalidateHealth } from 'System/useSystem';
import { invalidateTags } from 'Tags/useTags';
import { repopulatePage } from 'Utilities/pagePopulator';
import titleCase from 'Utilities/String/titleCase';
import { CUTOFF_UNMET_PATH } from 'Wanted/CutoffUnmet/useCutoffUnmet';
import { MISSING_PATH } from 'Wanted/Missing/useMissing';

function getHandlerName(name) {
  name = titleCase(name);
  name = name.replace('/', '');

  return `handle${name}`;
}

function Logger(minimumLogLevel) {
  this.minimumLogLevel = minimumLogLevel;
}

Logger.prototype.cleanse = function(message) {
  const apikey = new RegExp(`access_token=${encodeURIComponent(window.Radarr.apiKey)}`, 'g');
  return message.replace(apikey, 'access_token=(removed)');
};

Logger.prototype.log = function(logLevel, message) {
  // see https://github.com/aspnet/AspNetCore/blob/21c9e2cc954c10719878839cd3f766aca5f57b34/src/SignalR/clients/ts/signalr/src/Utils.ts#L147
  if (logLevel >= this.minimumLogLevel) {
    switch (logLevel) {
      case signalR.LogLevel.Critical:
      case signalR.LogLevel.Error:
        console.error(`[signalR] ${signalR.LogLevel[logLevel]}: ${this.cleanse(message)}`);
        break;
      case signalR.LogLevel.Warning:
        console.warn(`[signalR] ${signalR.LogLevel[logLevel]}: ${this.cleanse(message)}`);
        break;
      case signalR.LogLevel.Information:
        console.info(`[signalR] ${signalR.LogLevel[logLevel]}: ${this.cleanse(message)}`);
        break;
      default:
        // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
        console.log(`[signalR] ${signalR.LogLevel[logLevel]}: ${this.cleanse(message)}`);
        break;
    }
  }
};

class SignalRConnector extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.connection = null;
  }

  componentDidMount() {
    console.log('[signalR] starting');

    const url = `${window.Radarr.urlBase}/signalr/messages`;

    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(new Logger(signalR.LogLevel.Information))
      .withUrl(`${url}?access_token=${encodeURIComponent(window.Radarr.apiKey)}`)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.elapsedMilliseconds > 180000) {
            setAppValue({ isDisconnected: true });
          }
          return Math.min(retryContext.previousRetryCount, 10) * 1000;
        }
      })
      .build();

    this.connection.onreconnecting(this.onReconnecting);
    this.connection.onreconnected(this.onReconnected);
    this.connection.onclose(this.onClose);

    this.connection.on('receiveMessage', this.onReceiveMessage);

    this.connection.start().then(this.onStart, this.onStartFail);
  }

  componentWillUnmount() {
    this.connection.stop();
    this.connection = null;
  }

  //
  // Control
  handleMessage = (message) => {
    const {
      name,
      body
    } = message;

    const handler = this[getHandlerName(name)];

    if (handler) {
      handler(body);
      return;
    }

    console.error(`signalR: Unable to find handler for ${name}`);
  };

  handleCalendar = (body) => {
    if (body.action === 'updated') {
      updateCalendarItem(queryClient, body.resource);
    }
  };

  handleCommand = (body) => {
    if (body.action === 'sync') {
      invalidateCommands(queryClient);
      return;
    }

    const resource = body.resource;
    const status = resource.status;
    const messageActions = {
      showMessage,
      hideMessage
    };

    // Both successful and failed commands need to be
    // completed, otherwise they spin until they time out.

    if (status === 'completed' || status === 'failed') {
      handleCommandFinished(resource, messageActions);
    } else {
      handleCommandUpdated(resource, messageActions);
    }
  };

  handleMoviefile = (body) => {
    if (body.action === 'updated') {
      updateMovieFile(queryClient, body.resource);

      // Repopulate the page to handle recently imported file
      repopulatePage('movieFileUpdated');
    } else if (body.action === 'deleted') {
      removeMovieFiles(queryClient, [body.resource.id]);

      repopulatePage('movieFileDeleted');
    }
  };

  handleDownloadclient = () => {
    invalidateApiQueries(queryClient, DOWNLOAD_CLIENTS_PATH);
  };

  handleHealth = () => {
    invalidateHealth(queryClient);
  };

  handleImportlist = () => {
    invalidateApiQueries(queryClient, IMPORT_LISTS_PATH);
  };

  handleIndexer = () => {
    invalidateApiQueries(queryClient, INDEXERS_PATH);
  };

  handleMetadata = () => {
    invalidateApiQueries(queryClient, METADATA_PATH);
  };

  handleNotification = () => {
    invalidateApiQueries(queryClient, NOTIFICATIONS_PATH);
  };

  handleMovie = (body) => {
    const action = body.action;

    if (action === 'updated') {
      setMovie(queryClient, body.resource);

      repopulatePage('movieUpdated');
    } else if (action === 'deleted') {
      removeMovies(queryClient, [body.resource.id]);
    }
  };

  handleCollection = (body) => {
    const action = body.action;

    if (action === 'updated') {
      setMovieCollection(queryClient, body.resource);
    } else if (action === 'deleted') {
      removeMovieCollection(queryClient, body.resource.id);
    }
  };

  handleQualitydefinition = () => {
    invalidateApiQueries(queryClient, QUALITY_DEFINITIONS_PATH);
  };

  handleQueue = () => {
    invalidateQueuePages(queryClient);
  };

  handleQueueDetails = () => {
    invalidateQueueDetails(queryClient);
  };

  handleQueueStatus = (body) => {
    setQueueStatus(queryClient, body.resource);
  };

  handleVersion = (body) => {
    const version = body.version;

    setVersion({ version });
  };

  handleWantedCutoff = (body) => {
    if (body.action === 'updated') {
      invalidateApiQueries(queryClient, CUTOFF_UNMET_PATH);
    }
  };

  handleWantedMissing = (body) => {
    if (body.action === 'updated') {
      invalidateApiQueries(queryClient, MISSING_PATH);
    }
  };

  handleSystemTask = () => {
    invalidateCommands(queryClient);
  };

  handleRootfolder = () => {
    invalidateRootFolders(queryClient);
  };

  handleTag = (body) => {
    if (body.action === 'sync') {
      invalidateTags(queryClient);
      return;
    }
  };

  //
  // Listeners

  onStartFail = (error) => {
    console.error('[signalR] failed to connect');
    console.error(error);

    setAppValue({
      isConnected: false,
      isReconnecting: false,
      isDisconnected: false,
      isRestarting: false
    });
  };

  onStart = () => {
    console.debug('[signalR] connected');

    setAppValue({
      isConnected: true,
      isReconnecting: false,
      isDisconnected: false,
      isRestarting: false
    });
  };

  onReconnecting = () => {
    setAppValue({ isReconnecting: true });
  };

  onReconnected = () => {

    setAppValue({
      isConnected: true,
      isReconnecting: false,
      isDisconnected: false,
      isRestarting: false
    });

    // Repopulate the page (if a repopulator is set) to ensure things
    // are in sync after reconnecting.
    invalidateMovies(queryClient);
    invalidateMovieCollections(queryClient);
    invalidateMovieFiles(queryClient);
    invalidateCommands(queryClient);
    invalidateQueue(queryClient);
    repopulatePage();
  };

  onClose = () => {
    console.debug('[signalR] connection closed');
  };

  onReceiveMessage = (message) => {
    console.debug('[signalR] received', message.name, message.body);

    this.handleMessage(message);
  };

  //
  // Render

  render() {
    return null;
  }
}

export default SignalRConnector;
