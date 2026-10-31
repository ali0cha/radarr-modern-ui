import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import ExtraFileTableContent from './ExtraFileTableContent';
import useExtraFiles from './useExtraFiles';

function ExtraFileTableContentConnector({ movieId, ...otherProps }) {
  const { data } = useExtraFiles(movieId);

  const items = useMemo(() => {
    return (data ?? []).filter((file) => file.movieId === movieId);
  }, [data, movieId]);

  return (
    <ExtraFileTableContent
      movieId={movieId}
      {...otherProps}
      items={items}
      error={null}
    />
  );
}

ExtraFileTableContentConnector.propTypes = {
  movieId: PropTypes.number.isRequired
};

export default ExtraFileTableContentConnector;
