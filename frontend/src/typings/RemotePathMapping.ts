import ModelBase from 'App/ModelBase';

export default interface RemotePathMapping extends ModelBase {
  host: string;
  remotePath: string;
  localPath: string;
}
