import ModelBase from 'App/ModelBase';

export interface OrganizePreviewModel extends ModelBase {
  movieId: number;
  movieFileId: number;
  existingPath: string;
  newPath: string;
}
