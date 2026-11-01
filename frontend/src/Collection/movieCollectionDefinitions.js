import { filterBuilderTypes, filterBuilderValueTypes, filterTypePredicates, filterTypes } from 'Helpers/Props';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';

export const filters = [
  {
    key: 'all',
    label: () => translate('All'),
    filters: []
  },
  {
    key: 'missing',
    label: () => translate('Missing'),
    filters: [
      {
        key: 'missingMovies',
        value: 0,
        type: filterTypes.GREATER_THAN
      }
    ]
  },
  {
    key: 'complete',
    label: () => translate('Complete'),
    filters: [
      {
        key: 'missingMovies',
        value: 0,
        type: filterTypes.EQUAL
      }
    ]
  }
];

export const filterPredicates = {
  genres: function(item, filterValue, type) {
    const predicate = filterTypePredicates[type];

    const allGenres = item.movies.flatMap(({ genres }) => genres);
    const genres = Array.from(new Set(allGenres));

    return predicate(genres, filterValue);
  },
  totalMovies: function(item, filterValue, type) {
    const predicate = filterTypePredicates[type];
    const { movies } = item;

    const totalMovies = movies.length;
    return predicate(totalMovies, filterValue);
  }
};

export const filterBuilderProps = [
  {
    name: 'title',
    label: () => translate('Title'),
    type: filterBuilderTypes.STRING
  },
  {
    name: 'monitored',
    label: () => translate('Monitored'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.BOOL
  },
  {
    name: 'qualityProfileId',
    label: () => translate('QualityProfile'),
    type: filterBuilderTypes.EXACT,
    valueType: filterBuilderValueTypes.QUALITY_PROFILE
  },
  {
    name: 'rootFolderPath',
    label: () => translate('RootFolder'),
    type: filterBuilderTypes.STRING
  },
  {
    name: 'genres',
    label: () => translate('Genres'),
    type: filterBuilderTypes.ARRAY,
    optionsSelector: function(items) {
      const genreList = items.reduce((acc, collection) => {
        const collectionGenres = collection.movies.flatMap(({ genres }) => genres);
        const genres = Array.from(new Set(collectionGenres));

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
    name: 'totalMovies',
    label: () => translate('TotalMovies'),
    type: filterBuilderTypes.NUMBER
  }
];
