import ModelBase from 'App/ModelBase';

interface Backup extends ModelBase {
  name: string;
  path: string;
  type: 'scheduled' | 'manual' | 'update';
  size: number;
  time: string;
}

export default Backup;
