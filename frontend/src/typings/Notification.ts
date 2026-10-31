import Provider from './Provider';

interface Notification extends Provider {
  enable: boolean;
  onGrab: boolean;
  onDownload: boolean;
  onUpgrade: boolean;
  onRename: boolean;
  onMovieAdded: boolean;
  onMovieDelete: boolean;
  onMovieFileDelete: boolean;
  onMovieFileDeleteForUpgrade: boolean;
  onHealthIssue: boolean;
  onHealthRestored: boolean;
  onApplicationUpdate: boolean;
  onManualInteractionRequired: boolean;
  supportsOnGrab: boolean;
  supportsOnDownload: boolean;
  supportsOnUpgrade: boolean;
  supportsOnRename: boolean;
  supportsOnMovieAdded: boolean;
  supportsOnMovieDelete: boolean;
  supportsOnMovieFileDelete: boolean;
  supportsOnMovieFileDeleteForUpgrade: boolean;
  supportsOnHealthIssue: boolean;
  supportsOnHealthRestored: boolean;
  supportsOnApplicationUpdate: boolean;
  supportsOnManualInteractionRequired: boolean;
  includeHealthWarnings: boolean;
  tags: number[];
}

export default Notification;
