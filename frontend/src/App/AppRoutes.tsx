import React from 'react';
import { Route } from 'react-router-dom';
import Blocklist from 'Activity/Blocklist/Blocklist';
import History from 'Activity/History/History';
import Queue from 'Activity/Queue/Queue';
import AddNewMovieConnector from 'AddMovie/AddNewMovie/AddNewMovieConnector';
import ImportMovieConnector from 'AddMovie/ImportMovie/Import/ImportMovieConnector';
import ImportMovieSelectFolderConnector from 'AddMovie/ImportMovie/SelectFolder/ImportMovieSelectFolderConnector';
import CalendarPage from 'Calendar/CalendarPage';
import CollectionConnector from 'Collection/CollectionConnector';
import NotFound from 'Components/NotFound';
import DiscoverMovieConnector from 'DiscoverMovie/DiscoverMovieConnector';
import MovieDetailsPage from 'Movie/Details/MovieDetailsPage';
import MovieIndex from 'Movie/Index/MovieIndex';
import CustomFormatSettingsPage from 'Settings/CustomFormats/CustomFormatSettingsPage';
import DownloadClientSettingsConnector from 'Settings/DownloadClients/DownloadClientSettingsConnector';
import GeneralSettings from 'Settings/General/GeneralSettings';
import ImportListSettings from 'Settings/ImportLists/ImportListSettings';
import IndexerSettings from 'Settings/Indexers/IndexerSettings';
import MediaManagement from 'Settings/MediaManagement/MediaManagement';
import MetadataSettings from 'Settings/Metadata/MetadataSettings';
import NotificationSettings from 'Settings/Notifications/NotificationSettings';
import Profiles from 'Settings/Profiles/Profiles';
import QualityConnector from 'Settings/Quality/QualityConnector';
import Settings from 'Settings/Settings';
import TagSettings from 'Settings/Tags/TagSettings';
import UISettingsConnector from 'Settings/UI/UISettingsConnector';
import BackupsConnector from 'System/Backup/BackupsConnector';
import LogsTableConnector from 'System/Events/LogsTableConnector';
import AppLogFiles from 'System/Logs/App/AppLogFiles';
import UpdateLogFiles from 'System/Logs/Update/UpdateLogFiles';
import Status from 'System/Status/Status';
import Tasks from 'System/Tasks/Tasks';
import Updates from 'System/Updates/Updates';
import CutoffUnmet from 'Wanted/CutoffUnmet/CutoffUnmet';
import Missing from 'Wanted/Missing/Missing';

export function appRouteElements() {
  return (
    <>
      {/*
        Movies
      */}

      <Route path="/" element={<MovieIndex />} />

      <Route path="/add/new" element={<AddNewMovieConnector />} />

      <Route path="/collections" element={<CollectionConnector />} />

      <Route
        path="/add/import"
        element={<ImportMovieSelectFolderConnector />}
      />

      <Route
        path="/add/import/:rootFolderId"
        element={<ImportMovieConnector />}
      />

      <Route path="/add/discover" element={<DiscoverMovieConnector />} />

      <Route path="/movie/:titleSlug" element={<MovieDetailsPage />} />

      {/*
        Calendar
      */}

      <Route path="/calendar" element={<CalendarPage />} />

      {/*
        Activity
      */}

      <Route path="/activity/history" element={<History />} />

      <Route path="/activity/queue" element={<Queue />} />

      <Route path="/activity/blocklist" element={<Blocklist />} />

      {/*
        Wanted
      */}

      <Route path="/wanted/missing" element={<Missing />} />

      <Route path="/wanted/cutoffunmet" element={<CutoffUnmet />} />

      {/*
        Settings
      */}

      <Route path="/settings" element={<Settings />} />

      <Route path="/settings/mediamanagement" element={<MediaManagement />} />

      <Route path="/settings/profiles" element={<Profiles />} />

      <Route path="/settings/quality" element={<QualityConnector />} />

      <Route
        path="/settings/customformats"
        element={<CustomFormatSettingsPage />}
      />

      <Route path="/settings/indexers" element={<IndexerSettings />} />

      <Route
        path="/settings/downloadclients"
        element={<DownloadClientSettingsConnector />}
      />

      <Route path="/settings/importlists" element={<ImportListSettings />} />

      <Route path="/settings/connect" element={<NotificationSettings />} />

      <Route path="/settings/metadata" element={<MetadataSettings />} />

      <Route path="/settings/tags" element={<TagSettings />} />

      <Route path="/settings/general" element={<GeneralSettings />} />

      <Route path="/settings/ui" element={<UISettingsConnector />} />

      {/*
        System
      */}

      <Route path="/system/status" element={<Status />} />

      <Route path="/system/tasks" element={<Tasks />} />

      <Route path="/system/backup" element={<BackupsConnector />} />

      <Route path="/system/updates" element={<Updates />} />

      <Route path="/system/events" element={<LogsTableConnector />} />

      <Route path="/system/logs/files" element={<AppLogFiles />} />

      <Route path="/system/logs/files/update" element={<UpdateLogFiles />} />

      {/*
        Not Found
      */}

      <Route path="*" element={<NotFound />} />
    </>
  );
}
