import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useMovieCollection } from 'Collection/useMovieCollections';

function CollectionItemConnector(props) {
  const {
    id: itemId,
    collectionId,
    component: ItemComponent,
    ...otherProps
  } = props;

  const collection = useMovieCollection(collectionId);

  const data = useMemo(() => {
    // If a collection is deleted this may render before the parent does, which
    // will result in an undefined collection, if that happens we want to return
    // early here to avoid trying to show a collection that has no information
    // available.

    if (!collection) {
      return {};
    }

    const allGenres = collection.movies.flatMap((movie) => movie.genres);

    return {
      ...collection,
      movies: [...collection.movies].sort((a, b) => b.year - a.year),
      genres: Array.from(new Set(allGenres))
    };
  }, [collection]);

  if (!data.id) {
    return null;
  }

  return (
    <ItemComponent
      {...otherProps}
      collectionId={collectionId}
      {...data}
    />
  );
}

CollectionItemConnector.propTypes = {
  id: PropTypes.number,
  collectionId: PropTypes.number,
  component: PropTypes.elementType.isRequired
};

export default CollectionItemConnector;
