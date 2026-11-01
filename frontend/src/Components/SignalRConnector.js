import * as signalR from '@microsoft/signalr/dist/browser/signalr.js';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  invalidateQueue,
  invalidateQueueDetails,
  invalidateQueuePages,
  setQueueStatus
} from 'Activity/Queue/useQueue';
import { queryClient } from 'App/queryClient';
import { handleCommandFinished, handleCommandUpdated } from 'Commands/commandEvents';
import { invalidateCommands } from 'Commands/useCommands';
import { invalidateApiQueries } from 'Helpers/Hooks/useApiQuery';
import { invalidateMovies, removeMovies, setMovie } from 'Movie/useMovies';
import { invalidateRootFolders } from 'RootFolder/useRootFolders';
import { DOWNLOAD_CLIENTS_PATH } from 'Settings/DownloadClients/useDownloadClients';
import { IMPORT_LISTS_PATH } from 'Settings/ImportLists/useImportLists';
import { INDEXERS_PATH } from 'Settings/Indexers/useIndexers';
import { METADATA_PATH } from 'Settings/Metadata/Metadata/useMetadata';
import { NOTIFICATIONS_PATH } from 'Settings/Notifications/useNotifications';
import { QUALITY_DEFINITIONS_PATH } from 'Settings/Quality/Definition/useQualityDefinitions';
import { hideMessage, setAppValue, setVersion, showMessage } from 'Store/Actions/appActions';
import { removeItem, update, updateItem } from 'Store/Actions/baseActions';
import { fetchHealth } from 'Store/Actions/systemActions';
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

function createMapStateToProps() {
  return createSelector(
    (state) => state.app.isReconnecting,
    (state) => state.app.isDisconnected,
    (isReconnecting, isDisconnected) => {
      return {
        isReconnecting,
        isDisconnected
      };
    }
  );
}

const mapDispatchToProps = {
  dispatchShowMessage: showMessage,
  dispatchHideMessage: hideMessage,
  dispatchSetAppValue: setAppValue,
  dispatchSetVersion: setVersion,
  dispatchUpdate: update,
  dispatchUpdateItem: updateItem,
  dispatchRemoveItem: removeItem,
  dispatchFetchHealth: fetchHealth
};

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
            this.props.dispatchSetAppValue({ isDisconnected: true });
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
      this.props.dispatchUpdateItem({
        section: 'calendar',
        updateOnly: true,
        ...body.resource
      });
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
      showMessage: this.props.dispatchShowMessage,
      hideMessage: this.props.dispatchHideMessage
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
    const section = 'movieFiles';

    if (body.action === 'updated') {
      this.props.dispatchUpdateItem({ section, ...body.resource });

      // Repopulate the page to handle recently imported file
      repopulatePage('movieFileUpdated');
    } else if (body.action === 'deleted') {
      this.props.dispatchRemoveItem({ section, id: body.resource.id });

      repopulatePage('movieFileDeleted');
    }
  };

  handleDownloadclient = () => {
    invalidateApiQueries(queryClient, DOWNLOAD_CLIENTS_PATH);
  };

  handleHealth = () => {
    this.props.dispatchFetchHealth();
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
    const section = 'movieCollections';

    console.log(body);

    if (action === 'updated') {
      this.props.dispatchUpdateItem({ section, ...body.resource });
    } else if (action === 'deleted') {
      this.props.dispatchRemoveItem({ section, id: body.resource.id });
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

    this.props.dispatchSetVersion({ version });
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

    this.props.dispatchSetAppValue({
      isConnected: false,
      isReconnecting: false,
      isDisconnected: false,
      isRestarting: false
    });
  };

  onStart = () => {
    console.debug('[signalR] connected');

    this.props.dispatchSetAppValue({
      isConnected: true,
      isReconnecting: false,
      isDisconnected: false,
      isRestarting: false
    });
  };

  onReconnecting = () => {
    this.props.dispatchSetAppValue({ isReconnecting: true });
  };

  onReconnected = () => {

    const {
      dispatchSetAppValue
    } = this.props;

    dispatchSetAppValue({
      isConnected: true,
      isReconnecting: false,
      isDisconnected: false,
      isRestarting: false
    });

    // Repopulate the page (if a repopulator is set) to ensure things
    // are in sync after reconnecting.
    invalidateMovies(queryClient);
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

SignalRConnector.propTypes = {
  isReconnecting: PropTypes.bool.isRequired,
  isDisconnected: PropTypes.bool.isRequired,
  dispatchShowMessage: PropTypes.func.isRequired,
  dispatchHideMessage: PropTypes.func.isRequired,
  dispatchSetAppValue: PropTypes.func.isRequired,
  dispatchSetVersion: PropTypes.func.isRequired,
  dispatchUpdate: PropTypes.func.isRequired,
  dispatchUpdateItem: PropTypes.func.isRequired,
  dispatchRemoveItem: PropTypes.func.isRequired,
  dispatchFetchHealth: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(SignalRConnector);
