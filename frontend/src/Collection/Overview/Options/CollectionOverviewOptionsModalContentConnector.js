import React from 'react';
import { useMovieCollectionsStore } from 'Collection/useMovieCollections';
import CollectionOverviewOptionsModalContent from './CollectionOverviewOptionsModalContent';

function CollectionOverviewOptionsModalContentConnector(props) {
  const options = useMovieCollectionsStore((state) => state.options);
  const overviewOptions = useMovieCollectionsStore((state) => state.overviewOptions);
  const onChangeOverviewOption = useMovieCollectionsStore((state) => state.setOverviewOptions);
  const onChangeOption = useMovieCollectionsStore((state) => state.setOptions);

  return (
    <CollectionOverviewOptionsModalContent
      {...props}
      {...options}
      {...overviewOptions}
      onChangeOverviewOption={onChangeOverviewOption}
      onChangeOption={onChangeOption}
    />
  );
}

export default CollectionOverviewOptionsModalContentConnector;
