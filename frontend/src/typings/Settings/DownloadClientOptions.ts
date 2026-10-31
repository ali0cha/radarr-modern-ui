export default interface DownloadClientOptions {
  enableCompletedDownloadHandling: boolean;
  checkForFinishedDownloadInterval: number;
  autoRedownloadFailed: boolean;
  autoRedownloadFailedFromInteractiveSearch: boolean;
}
