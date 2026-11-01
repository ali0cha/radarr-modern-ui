import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMovies } from 'Movie/useMovies';
import { usePrefetchRootFolders } from 'RootFolder/useRootFolders';
import parseUrl from 'Utilities/String/parseUrl';
import { useMovieLookup } from '../useAddMovie';
import AddNewMovie from './AddNewMovie';

function AddNewMovieConnectorBase({ locationSearch }) {
  const { params } = parseUrl(locationSearch);

  // What is searched for, it follows what is typed after a short while
  const [lookupTerm, setLookupTerm] = useState('');
  const lookupTermRef = useRef('');
  const lookupTimeoutRef = useRef(null);

  const { items, isFetching, isPopulated, error, refetch } = useMovieLookup(lookupTerm);
  const { movies } = useMovies();
  const cancelLookupTimeout = useCallback(() => {
    if (lookupTimeoutRef.current) {
      clearTimeout(lookupTimeoutRef.current);
      lookupTimeoutRef.current = null;
    }
  }, []);

  const changeLookupTerm = useCallback((term) => {
    lookupTermRef.current = term;
    setLookupTerm(term);
  }, []);

  useEffect(() => cancelLookupTimeout, [cancelLookupTimeout]);

  const handleMovieLookupChange = useCallback((term) => {
    cancelLookupTimeout();

    if (term.trim() === '') {
      changeLookupTerm('');
    } else {
      lookupTimeoutRef.current = setTimeout(() => {
        lookupTimeoutRef.current = null;

        // Searching again for what is already there still has to show that it
        // was done
        if (term === lookupTermRef.current) {
          refetch();
        } else {
          changeLookupTerm(term);
        }
      }, 300);
    }
  }, [cancelLookupTimeout, changeLookupTerm, refetch]);

  const handleClearMovieLookup = useCallback(() => {
    cancelLookupTimeout();
    changeLookupTerm('');
  }, [cancelLookupTimeout, changeLookupTerm]);

  return (
    <AddNewMovie
      term={params.term}
      isFetching={isFetching}
      isPopulated={isPopulated}
      error={error}
      items={items}
      hasExistingMovies={movies.length > 0}
      onMovieLookupChange={handleMovieLookupChange}
      onClearMovieLookup={handleClearMovieLookup}
    />
  );
}

AddNewMovieConnectorBase.propTypes = {
  locationSearch: PropTypes.string.isRequired
};

function AddNewMovieConnector() {
  const { search } = useLocation();

  usePrefetchRootFolders();

  return <AddNewMovieConnectorBase locationSearch={search} />;
}

export default AddNewMovieConnector;
