import ModelBase from 'App/ModelBase';
import Quality from 'Quality/Quality';

interface QualityDefinition extends ModelBase {
  quality: Quality;
  title: string;
  weight: number;
  minSize: number;
  maxSize: number | null;
  preferredSize: number | null;
}

export default QualityDefinition;
