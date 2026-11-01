import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useToggleMovieMonitored } from 'Movie/useMovies';

// For the connected components that have not been converted to hooks yet: the
// toggleMovieMonitored prop monitors or unmonitors the movie they show (the id
// prop), isSaving tells that it is being saved.
function withToggleMovieMonitored(WrappedComponent) {
  function WithToggleMovieMonitored(props) {
    const { toggleMonitored, isSaving } = useToggleMovieMonitored(props.id);

    const handleToggleMovieMonitored = useCallback(({ monitored }) => {
      toggleMonitored(monitored);
    }, [toggleMonitored]);

    return (
      <WrappedComponent
        {...props}
        isSaving={isSaving}
        toggleMovieMonitored={handleToggleMovieMonitored}
      />
    );
  }

  WithToggleMovieMonitored.propTypes = {
    id: PropTypes.number
  };

  return WithToggleMovieMonitored;
}

export default withToggleMovieMonitored;
