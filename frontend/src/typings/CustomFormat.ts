import ModelBase from 'App/ModelBase';
import Provider from './Provider';

export interface QualityProfileFormatItem {
  format: number;
  name: string;
  score: number;
}

// A condition of a custom format
export interface CustomFormatSpecification extends Provider {
  negate: boolean;
  required: boolean;
}

interface CustomFormat extends ModelBase {
  name: string;
  includeCustomFormatWhenRenaming: boolean;
  specifications?: CustomFormatSpecification[];
}

export default CustomFormat;
