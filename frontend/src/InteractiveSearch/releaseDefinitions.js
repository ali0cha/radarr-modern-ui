import { filterBuilderTypes, filterBuilderValueTypes, filterTypePredicates, filterTypes } from 'Helpers/Props';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';

export const sortPredicates = {
  age: function(item, direction) {
    return item.ageMinutes;
  },

  peers: function(item, direction) {
    const seeders = item.seeders || 0;
    const leechers = item.leechers || 0;

    return seeders * 1000000 + leechers;
  },

  languages: function(item, direction) {
    if (item.languages.length > 1) {
      return 10000;
    }

    return item.languages[0]?.id ?? 0;
  },

  indexerFlags: function(item, direction) {
    const indexerFlags = item.indexerFlags;
    const releaseWeight = item.releaseWeight;

    if (indexerFlags.length === 0) {
      return releaseWeight + 1000000;
    }

    return releaseWeight;
  },

  rejections: function(item, direction) {
    const rejections = item.rejections;
    const releaseWeight = item.releaseWeight;

    if (rejections.length !== 0) {
      return releaseWeight + 1000000;
    }

    return releaseWeight;
  }
};

export const filters = [
  {
    key: 'all',
    label: () => translate('All'),
    filters: []
  }
];

export const filterPredicates = {
  quality: function(item, value, type) {
    const qualityId = item.quality.quality.id;

    if (type === filterTypes.EQUAL) {
      return qualityId === value;
    }

    if (type === filterTypes.NOT_EQUAL) {
      return qualityId !== value;
    }

    // Default to false
    return false;
  },

  languages: function(item, filterValue, type) {
    const predicate = filterTypePredicates[type];

    const languages = item.languages.map((language) => language.name);

    return predicate(languages, filterValue);
  },

  peers: function(item, value, type) {
    const predicate = filterTypePredicates[type];
    const seeders = item.seeders || 0;
    const leechers = item.leechers || 0;

    return predicate(seeders + leechers, value);
  },

  rejectionCount: function(item, value, type) {
    const rejectionCount = item.rejections.length;

    switch (type) {
      case filterTypes.EQUAL:
        return rejectionCount === value;

      case filterTypes.GREATER_THAN:
        return rejectionCount > value;

      case filterTypes.GREATER_THAN_OR_EQUAL:
        return rejectionCount >= value;

      case filterTypes.LESS_THAN:
        return rejectionCount < value;

      case filterTypes.LESS_THAN_OR_EQUAL:
        return rejectionCount <= value;

      case filterTypes.NOT_EQUAL:
        return rejectionCount !== value;

      default:
        return false;
    }
  }
};

export const filterBuilderProps = [
  {
    name: 'title',
    label: () => translate('Title'),
    type: filterBuilderTypes.STRING
  },
  {
    name: 'age',
    label: () => translate('Age'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'protocol',
    label: () => translate('Protocol'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.PROTOCOL
  },
  {
    name: 'indexerId',
    label: () => translate('Indexer'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.INDEXER
  },
  {
    name: 'size',
    label: () => translate('Size'),
    type: filterBuilderTypes.NUMBER,
    valueType: filterBuilderValueTypes.BYTES
  },
  {
    name: 'seeders',
    label: () => translate('Seeders'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'peers',
    label: () => translate('Peers'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'quality',
    label: () => translate('Quality'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.QUALITY
  },
  {
    name: 'languages',
    label: () => translate('Languages'),
    type: filterBuilderTypes.ARRAY,
    optionsSelector: function(items) {
      const genreList = items.reduce((acc, release) => {
        release.languages.forEach((language) => {
          acc.push({
            id: language.name,
            name: language.name
          });
        });

        return acc;
      }, []);

      return genreList.sort(sortByProp('name'));
    }
  },
  {
    name: 'customFormatScore',
    label: () => translate('CustomFormatScore'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'rejectionCount',
    label: () => translate('RejectionCount'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'movieRequested',
    label: () => translate('MovieRequested'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.BOOL
  }
];
