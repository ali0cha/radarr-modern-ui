import ModelBase from 'App/ModelBase';

export interface Tag extends ModelBase {
  label: string;
}

export interface TagDetail extends ModelBase {
  label: string;
  autoTagIds: number[];
  delayProfileIds: number[];
  downloadClientIds: number[];
  importListIds: number[];
  indexerIds: number[];
  movieIds: number[];
  notificationIds: number[];
  releaseProfileIds: number[];
}
