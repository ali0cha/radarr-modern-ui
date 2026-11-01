import moment from 'moment';
import { filterTypePredicates, filterTypes, sortDirections } from 'Helpers/Props';
import dateFilterPredicate from 'Utilities/Date/dateFilterPredicate';
import padNumber from 'Utilities/Number/padNumber';
import translate from 'Utilities/String/translate';

export const filters = [
  {
    key: 'all',
    label: () => translate('All'),
    filters: []
  },
  {
    key: 'monitored',
    label: () => translate('MonitoredOnly'),
    filters: [
      {
        key: 'monitored',
        value: true,
        type: filterTypes.EQUAL
      }
    ]
  },
  {
    key: 'unmonitored',
    label: () => translate('Unmonitored'),
    filters: [
      {
        key: 'monitored',
        value: false,
        type: filterTypes.EQUAL
      }
    ]
  },
  {
    key: 'missing',
    label: () => translate('Missing'),
    filters: [
      {
        key: 'monitored',
        value: true,
        type: filterTypes.EQUAL
      },
      {
        key: 'hasFile',
        value: false,
        type: filterTypes.EQUAL
      }
    ]
  },
  {
    key: 'wanted',
    label: () => translate('Wanted'),
    filters: [
      {
        key: 'monitored',
        value: true,
        type: filterTypes.EQUAL
      },
      {
        key: 'hasFile',
        value: false,
        type: filterTypes.EQUAL
      },
      {
        key: 'isAvailable',
        value: true,
        type: filterTypes.EQUAL
      }
    ]
  },
  {
    key: 'cutoffunmet',
    label: () => translate('CutoffUnmet'),
    filters: [
      {
        key: 'monitored',
        value: true,
        type: filterTypes.EQUAL
      },
      {
        key: 'hasFile',
        value: true,
        type: filterTypes.EQUAL
      },
      {
        key: 'qualityCutoffNotMet',
        value: true,
        type: filterTypes.EQUAL
      }
    ]
  }
];

export const filterPredicates = {
  added: function(item, filterValue, type) {
    return dateFilterPredicate(item.added, filterValue, type);
  },

  collection: function(item, filterValue, type) {
    const predicate = filterTypePredicates[type];
    const { collection } = item;

    return predicate(collection && collection.title ? collection.title : '', filterValue);
  },

  originalLanguage: function(item, filterValue, type) {
    const predicate = filterTypePredicates[type];
    const { originalLanguage } = item;

    return predicate(originalLanguage ? originalLanguage.name : '', filterValue);
  },

  releaseGroups: function(item, filterValue, type) {
    const predicate = filterTypePredicates[type];
    const { statistics = {} } = item;
    const { releaseGroups = [] } = statistics;

    return predicate(releaseGroups, filterValue);
  },

  movieFileQualities: function(item, filterValue, type) {
    const predicate = filterTypePredicates[type];
    const movieFileQualities = (
      item.statistics?.movieFileQualities ?? []
    ).map((q) => q.id);
    return predicate(movieFileQualities, filterValue);
  },

  sizeOnDisk: function(item, filterValue, type) {
    const predicate = filterTypePredicates[type];
    const { statistics = {} } = item;
    const sizeOnDisk = statistics && statistics.sizeOnDisk ? statistics.sizeOnDisk : 0;

    return predicate(sizeOnDisk, filterValue);
  },

  inCinemas: function(item, filterValue, type) {
    return dateFilterPredicate(item.inCinemas, filterValue, type);
  },

  physicalRelease: function(item, filterValue, type) {
    return dateFilterPredicate(item.physicalRelease, filterValue, type);
  },

  digitalRelease: function(item, filterValue, type) {
    return dateFilterPredicate(item.digitalRelease, filterValue, type);
  },

  releaseDate: function(item, filterValue, type) {
    return dateFilterPredicate(item.releaseDate, filterValue, type);
  },

  tmdbRating: function({ ratings = {} }, filterValue, type) {
    const predicate = filterTypePredicates[type];

    const rating = ratings.tmdb ? ratings.tmdb.value : 0;

    return predicate(rating * 10, filterValue);
  },

  tmdbVotes: function({ ratings = {} }, filterValue, type) {
    const predicate = filterTypePredicates[type];

    const rating = ratings.tmdb ? ratings.tmdb.votes : 0;

    return predicate(rating, filterValue);
  },

  imdbRating: function({ ratings = {} }, filterValue, type) {
    const predicate = filterTypePredicates[type];

    const rating = ratings.imdb ? ratings.imdb.value : 0;

    return predicate(rating, filterValue);
  },

  imdbVotes: function({ ratings = {} }, filterValue, type) {
    const predicate = filterTypePredicates[type];

    const rating = ratings.imdb ? ratings.imdb.votes : 0;

    return predicate(rating, filterValue);
  },

  rottenTomatoesRating: function({ ratings = {} }, filterValue, type) {
    const predicate = filterTypePredicates[type];

    const rating = ratings.rottenTomatoes ? ratings.rottenTomatoes.value : 0;

    return predicate(rating, filterValue);
  },

  traktRating: function({ ratings = {} }, filterValue, type) {
    const predicate = filterTypePredicates[type];

    const rating = ratings.trakt ? ratings.trakt.value : 0;

    return predicate(rating * 10, filterValue);
  },

  traktVotes: function({ ratings = {} }, filterValue, type) {
    const predicate = filterTypePredicates[type];

    const rating = ratings.trakt ? ratings.trakt.votes : 0;

    return predicate(rating, filterValue);
  },

  qualityCutoffNotMet: function(item) {
    const { movieFile = {} } = item;

    return movieFile.qualityCutoffNotMet;
  }
};

export const sortPredicates = {
  status: function(item) {
    let result = 0;

    if (item.monitored) {
      result += 4;
    }

    if (item.status === 'announced') {
      result++;
    }

    if (item.status === 'inCinemas') {
      result += 2;
    }

    if (item.status === 'released') {
      result += 3;
    }

    return result;
  },

  movieStatus: function(item) {
    let result = 0;
    let qualityName = '';

    const hasMovieFile = !!item.movieFile;

    if (item.isAvailable) {
      result++;
    }

    if (item.monitored) {
      result += 2;
    }

    if (hasMovieFile) {
      // TODO: Consider Quality Weight for Sorting within status of hasMovie
      if (item.movieFile.qualityCutoffNotMet) {
        result += 4;
      } else {
        result += 8;
      }
      qualityName = item.movieFile.quality.quality.name;
    }

    return padNumber(result.toString(), 2) + qualityName;
  },

  year: function(item) {
    return item.year || undefined;
  },

  inCinemas: function(item, direction) {
    const { inCinemas } = item;

    if (inCinemas) {
      return moment(inCinemas).unix();
    }

    if (direction === sortDirections.DESCENDING) {
      return -1 * Number.MAX_VALUE;
    }

    return Number.MAX_VALUE;
  },

  physicalRelease: function(item, direction) {
    const { physicalRelease } = item;

    if (physicalRelease) {
      return moment(physicalRelease).unix();
    }

    if (direction === sortDirections.DESCENDING) {
      return -1 * Number.MAX_VALUE;
    }

    return Number.MAX_VALUE;
  },

  digitalRelease: function(item, direction) {
    const { digitalRelease } = item;

    if (digitalRelease) {
      return moment(digitalRelease).unix();
    }

    if (direction === sortDirections.DESCENDING) {
      return -1 * Number.MAX_VALUE;
    }

    return Number.MAX_VALUE;
  },

  releaseDate: function(item, direction) {
    const { releaseDate } = item;

    if (releaseDate) {
      return moment(releaseDate).unix();
    }

    if (direction === sortDirections.DESCENDING) {
      return -1 * Number.MAX_VALUE;
    }

    return Number.MAX_VALUE;
  },

  sizeOnDisk: function(item) {
    const { statistics = {} } = item;

    return statistics.sizeOnDisk || 0;
  }
};
