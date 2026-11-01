import moment from 'moment/moment';
import { filterBuilderTypes, filterBuilderValueTypes, filterTypes, sortDirections } from 'Helpers/Props';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';

export const columns = [
  {
    name: 'status',
    columnLabel: () => translate('Status'),
    isSortable: true,
    isVisible: true,
    isModifiable: false
  },
  {
    name: 'isRecommendation',
    columnLabel: () => translate('Recommendation'),
    isSortable: true,
    isVisible: true,
    isModifiable: false
  },
  {
    name: 'isTrending',
    columnLabel: () => translate('Trending'),
    isSortable: true,
    isVisible: true,
    isModifiable: false
  },
  {
    name: 'isPopular',
    columnLabel: () => translate('Popular'),
    isSortable: true,
    isVisible: true,
    isModifiable: false
  },
  {
    name: 'sortTitle',
    label: () => translate('MovieTitle'),
    isSortable: true,
    isVisible: true,
    isModifiable: false
  },
  {
    name: 'originalLanguage',
    label: () => translate('OriginalLanguage'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'collection',
    label: () => translate('Collection'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'studio',
    label: () => translate('Studio'),
    isSortable: true,
    isVisible: true
  },
  {
    name: 'year',
    label: () => translate('Year'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'inCinemas',
    label: () => translate('InCinemas'),
    isSortable: true,
    isVisible: true
  },
  {
    name: 'digitalRelease',
    label: () => translate('DigitalRelease'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'physicalRelease',
    label: () => translate('PhysicalRelease'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'runtime',
    label: () => translate('Runtime'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'genres',
    label: () => translate('Genres'),
    isSortable: false,
    isVisible: false
  },
  {
    name: 'tmdbRating',
    label: () => translate('TmdbRating'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'imdbRating',
    label: () => translate('ImdbRating'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'rottenTomatoesRating',
    label: () => translate('RottenTomatoesRating'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'traktRating',
    label: () => translate('TraktRating'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'popularity',
    label: () => translate('Popularity'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'certification',
    label: () => translate('Certification'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'lists',
    label: () => translate('Lists'),
    isSortable: false,
    isVisible: false
  },
  {
    name: 'actions',
    columnLabel: () => translate('Actions'),
    isVisible: true,
    isModifiable: false
  }
];

export const sortPredicates = {
  status: function(item) {
    let result = 0;

    if (item.isExcluded) {
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

  collection: function(item) {
    const { collection ={} } = item;

    return collection.title;
  },

  originalLanguage: function(item) {
    const { originalLanguage ={} } = item;

    return originalLanguage.name;
  },

  studio: function(item) {
    const studio = item.studio;

    return studio ? studio.toLowerCase() : '';
  },

  inCinemas: function(item, direction) {
    if (item.inCinemas) {
      return moment(item.inCinemas).unix();
    }

    if (direction === sortDirections.DESCENDING) {
      return -1 * Number.MAX_VALUE;
    }

    return Number.MAX_VALUE;
  },

  physicalRelease: function(item, direction) {
    if (item.physicalRelease) {
      return moment(item.physicalRelease).unix();
    }

    if (direction === sortDirections.DESCENDING) {
      return -1 * Number.MAX_VALUE;
    }

    return Number.MAX_VALUE;
  },

  digitalRelease: function(item, direction) {
    if (item.digitalRelease) {
      return moment(item.digitalRelease).unix();
    }

    if (direction === sortDirections.DESCENDING) {
      return -1 * Number.MAX_VALUE;
    }

    return Number.MAX_VALUE;
  },

  tmdbRating: function({ ratings = {} }) {
    return ratings.tmdb ? ratings.tmdb.value : 0;
  },

  imdbRating: function({ ratings = {} }) {
    return ratings.imdb ? ratings.imdb.value : 0;
  },

  rottenTomatoesRating: function({ ratings = {} }) {
    return ratings.rottenTomatoes ? ratings.rottenTomatoes.value : -1;
  },

  traktRating: function({ ratings = {} }) {
    return ratings.trakt ? ratings.trakt.value : 0;
  }
};

export const filters = [
  {
    key: 'all',
    label: () => translate('All'),
    filters: []
  },
  {
    key: 'popular',
    label: () => translate('Popular'),
    filters: [
      {
        key: 'isPopular',
        value: true,
        type: filterTypes.EQUAL
      }
    ]
  },
  {
    key: 'trending',
    label: () => translate('Trending'),
    filters: [
      {
        key: 'isTrending',
        value: true,
        type: filterTypes.EQUAL
      }
    ]
  },
  {
    key: 'newNotExcluded',
    label: () => translate('NewNonExcluded'),
    filters: [
      {
        key: 'isExisting',
        value: false,
        type: filterTypes.EQUAL
      },
      {
        key: 'isExcluded',
        value: false,
        type: filterTypes.EQUAL
      }
    ]
  }
];

export const filterBuilderProps = [
  {
    name: 'status',
    label: () => translate('ReleaseStatus'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.RELEASE_STATUS
  },
  {
    name: 'studio',
    label: () => translate('Studio'),
    type: filterBuilderTypes.ARRAY,
    optionsSelector: function(items) {
      const tagList = items.reduce((acc, movie) => {
        acc.push({
          id: movie.studio,
          name: movie.studio
        });

        return acc;
      }, []);

      return tagList.sort(sortByProp('name'));
    }
  },
  {
    name: 'collection',
    label: () => translate('Collection'),
    type: filterBuilderTypes.ARRAY,
    optionsSelector: function(items) {
      const collectionList = items.reduce((acc, movie) => {
        if (movie.collection && movie.collection.title) {
          acc.push({
            id: movie.collection.title,
            name: movie.collection.title
          });
        }

        return acc;
      }, []);

      return collectionList.sort(sortByProp('name'));
    }
  },
  {
    name: 'originalLanguage',
    label: () => translate('OriginalLanguage'),
    type: filterBuilderTypes.EXACT,
    optionsSelector: function(items) {
      const collectionList = items.reduce((acc, movie) => {
        if (movie.originalLanguage) {
          acc.push({
            id: movie.originalLanguage.name,
            name: movie.originalLanguage.name
          });
        }

        return acc;
      }, []);

      return collectionList.sort(sortByProp('name'));
    }
  },
  {
    name: 'inCinemas',
    label: () => translate('InCinemas'),
    type: filterBuilderTypes.DATE,
    valueType: filterBuilderValueTypes.DATE
  },
  {
    name: 'physicalRelease',
    label: () => translate('PhysicalRelease'),
    type: filterBuilderTypes.DATE,
    valueType: filterBuilderValueTypes.DATE
  },
  {
    name: 'digitalRelease',
    label: () => translate('DigitalRelease'),
    type: filterBuilderTypes.DATE,
    valueType: filterBuilderValueTypes.DATE
  },
  {
    name: 'runtime',
    label: () => translate('Runtime'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'genres',
    label: () => translate('Genres'),
    type: filterBuilderTypes.ARRAY,
    optionsSelector: function(items) {
      const tagList = items.reduce((acc, movie) => {
        movie.genres.forEach((genre) => {
          acc.push({
            id: genre,
            name: genre
          });
        });

        return acc;
      }, []);

      return tagList.sort(sortByProp('name'));
    }
  },
  {
    name: 'isAvailable',
    label: () => translate('ConsideredAvailable'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.BOOL
  },
  {
    name: 'minimumAvailability',
    label: () => translate('MinimumAvailability'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.MINIMUM_AVAILABILITY
  },
  {
    name: 'tmdbRating',
    label: () => translate('TmdbRating'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'tmdbVotes',
    label: () => translate('TmdbVotes'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'imdbRating',
    label: () => translate('ImdbRating'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'imdbVotes',
    label: () => translate('ImdbVotes'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'traktRating',
    label: () => translate('TraktRating'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'traktVotes',
    label: () => translate('TraktVotes'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'popularity',
    label: () => translate('Popularity'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'certification',
    label: () => translate('Certification'),
    type: filterBuilderTypes.EXACT
  },
  {
    name: 'lists',
    label: () => translate('Lists'),
    type: filterBuilderTypes.ARRAY,
    valueType: filterBuilderValueTypes.IMPORTLIST
  },
  {
    name: 'isExcluded',
    label: () => translate('OnExcludedList'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.BOOL
  },
  {
    name: 'isExisting',
    label: () => translate('ExistsInLibrary'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.BOOL
  },
  {
    name: 'isRecommendation',
    label: () => translate('Recommended'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.BOOL
  },
  {
    name: 'isTrending',
    label: () => translate('Trending'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.BOOL
  },
  {
    name: 'isPopular',
    label: () => translate('Popular'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.BOOL
  }
];
