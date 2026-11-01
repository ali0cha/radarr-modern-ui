import { filterBuilderTypes, filterBuilderValueTypes } from 'Helpers/Props';
import { sortPredicates as baseSortPredicates } from 'Movie/movieDefinitions';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';

export const columns = [
  {
    name: 'select',
    columnLabel: 'Select',
    isSortable: false,
    isVisible: true,
    isModifiable: false,
    isHidden: true
  },
  {
    name: 'status',
    columnLabel: () => translate('ReleaseStatus'),
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
    name: 'originalTitle',
    label: () => translate('OriginalTitle'),
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
    name: 'qualityProfileId',
    label: () => translate('QualityProfile'),
    isSortable: true,
    isVisible: true
  },
  {
    name: 'originalLanguage',
    label: () => translate('OriginalLanguage'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'added',
    label: () => translate('Added'),
    isSortable: true,
    isVisible: false
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
    isVisible: false
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
    name: 'releaseDate',
    label: () => translate('ReleaseDate'),
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
    name: 'minimumAvailability',
    label: () => translate('MinimumAvailability'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'path',
    label: () => translate('Path'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'sizeOnDisk',
    label: () => translate('SizeOnDisk'),
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
    name: 'keywords',
    label: () => translate('Keywords'),
    isSortable: false,
    isVisible: false
  },
  {
    name: 'movieStatus',
    label: () => translate('Status'),
    isSortable: true,
    isVisible: true
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
    name: 'releaseGroups',
    label: () => translate('ReleaseGroup'),
    isSortable: true,
    isVisible: false
  },
  {
    name: 'movieFileQualities',
    label: () => translate('MovieFileQualities'),
    isSortable: false,
    isVisible: false
  },
  {
    name: 'tags',
    label: () => translate('Tags'),
    isSortable: true,
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
  ...baseSortPredicates,

  studio: function(item) {
    const studio = item.studio;

    return studio ? studio.toLowerCase() : '';
  },

  collection: function(item) {
    const { collection ={} } = item;

    return collection.title;
  },

  originalLanguage: function(item) {
    const { originalLanguage ={} } = item;

    return originalLanguage.name;
  },

  releaseGroups: function(item) {
    const { statistics = {} } = item;
    const { releaseGroups = [] } = statistics;

    return releaseGroups.length ?
      releaseGroups
        .map((group) => group.toLowerCase())
        .sort((a, b) => a.localeCompare(b)) :
      undefined;
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

export const filterBuilderProps = [
  {
    name: 'monitored',
    label: () => translate('Monitored'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.BOOL
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
    name: 'title',
    label: () => translate('Title'),
    type: filterBuilderTypes.STRING
  },
  {
    name: 'originalTitle',
    label: () => translate('OriginalTitle'),
    type: filterBuilderTypes.STRING
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
    name: 'releaseGroups',
    label: () => translate('ReleaseGroups'),
    type: filterBuilderTypes.ARRAY,
    optionsSelector: function(items) {
      const groupList = items.reduce((acc, movie) => {
        const { statistics = {} } = movie;
        const { releaseGroups = [] } = statistics;

        releaseGroups.forEach((releaseGroup) => {
          acc.push({
            id: releaseGroup,
            name: releaseGroup
          });
        });

        return acc;
      }, []);

      return groupList.sort(sortByProp('name'));
    }
  },
  {
    name: 'movieFileQualities',
    label: () => translate('MovieFileQualities'),
    type: filterBuilderTypes.ARRAY,
    valueType: filterBuilderValueTypes.QUALITY
  },
  {
    name: 'status',
    label: () => translate('ReleaseStatus'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.RELEASE_STATUS
  },
  {
    name: 'studio',
    label: () => translate('Studio'),
    type: filterBuilderTypes.EXACT,
    optionsSelector: function(items) {
      const tagList = items.reduce((acc, movie) => {
        if (movie.studio) {
          acc.push({
            id: movie.studio,
            name: movie.studio
          });
        }

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
    name: 'qualityProfileId',
    label: () => translate('QualityProfile'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.QUALITY_PROFILE
  },
  {
    name: 'added',
    label: () => translate('Added'),
    type: filterBuilderTypes.DATE,
    valueType: filterBuilderValueTypes.DATE
  },
  {
    name: 'year',
    label: () => translate('Year'),
    type: filterBuilderTypes.NUMBER
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
    name: 'releaseDate',
    label: () => translate('ReleaseDate'),
    type: filterBuilderTypes.DATE,
    valueType: filterBuilderValueTypes.DATE
  },
  {
    name: 'runtime',
    label: () => translate('Runtime'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'path',
    label: () => translate('Path'),
    type: filterBuilderTypes.STRING
  },
  {
    name: 'sizeOnDisk',
    label: () => translate('SizeOnDisk'),
    type: filterBuilderTypes.NUMBER,
    valueType: filterBuilderValueTypes.BYTES
  },
  {
    name: 'genres',
    label: () => translate('Genres'),
    type: filterBuilderTypes.ARRAY,
    optionsSelector: function(items) {
      const genreList = items.reduce((acc, { genres = [] }) => {
        genres.forEach((genre) => {
          acc.push({
            id: genre,
            name: genre
          });
        });

        return acc;
      }, []);

      return genreList.sort(sortByProp('name'));
    }
  },
  {
    name: 'keywords',
    label: () => translate('Keywords'),
    type: filterBuilderTypes.ARRAY,
    optionsSelector: function(items) {
      const keywordList = items.reduce((acc, { keywords = [] }) => {
        keywords.forEach((keyword) => {
          if (acc.findIndex((a) => a.id === keyword) === -1) {
            acc.push({
              id: keyword,
              name: keyword
            });
          }
        });

        return acc;
      }, []);

      return keywordList.sort(sortByProp('name'));
    }
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
    type: filterBuilderTypes.NUMBER,
    numberFractionDigits: 1
  },
  {
    name: 'imdbVotes',
    label: () => translate('ImdbVotes'),
    type: filterBuilderTypes.NUMBER
  },
  {
    name: 'rottenTomatoesRating',
    label: () => translate('RottenTomatoesRating'),
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
    type: filterBuilderTypes.EXACT,
    optionsSelector: function(items) {
      const certificationList = items.reduce((acc, movie) => {
        if (movie.certification) {
          acc.push({
            id: movie.certification,
            name: movie.certification
          });
        }

        return acc;
      }, []);

      return certificationList.sort(sortByProp('name'));
    }
  },
  {
    name: 'tags',
    label: () => translate('Tags'),
    type: filterBuilderTypes.ARRAY,
    valueType: filterBuilderValueTypes.TAG
  }
];
