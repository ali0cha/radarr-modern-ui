import Quality from 'Quality/Quality';
import { QualityProfileQualityItem } from 'typings/QualityProfile';

export default function getQualities(
  qualities?: QualityProfileQualityItem[]
): Quality[] {
  if (!qualities) {
    return [];
  }

  return qualities.reduce<Quality[]>((acc, item) => {
    if (item.quality) {
      acc.push(item.quality);
    } else {
      const groupQualities = item.items.map((i) => i.quality as Quality);
      acc.push(...groupQualities);
    }

    return acc;
  }, []);
}
