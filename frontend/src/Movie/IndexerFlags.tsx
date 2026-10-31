import React from 'react';
import useIndexerFlags from 'Settings/Indexers/useIndexerFlags';

interface IndexerFlagsProps {
  indexerFlags: number;
}

function IndexerFlags({ indexerFlags = 0 }: IndexerFlagsProps) {
  const allIndexerFlags = useIndexerFlags();

  const flags = allIndexerFlags.items.filter(
    // eslint-disable-next-line no-bitwise
    (item) => (indexerFlags & item.id) === item.id
  );

  return flags.length ? (
    <ul>
      {flags.map((flag, index) => {
        return <li key={index}>{flag.name}</li>;
      })}
    </ul>
  ) : null;
}

export default IndexerFlags;
