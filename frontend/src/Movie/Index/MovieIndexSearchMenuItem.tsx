import React, { useCallback, useMemo } from 'react';
import { useSelect } from 'App/SelectContext';
import { MOVIE_SEARCH } from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import PageToolbarOverflowMenuItem from 'Components/Page/Toolbar/PageToolbarOverflowMenuItem';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import { useMovieIndex } from './useMovieIndex';

interface MovieIndexSearchMenuItemProps {
  isSelectMode: boolean;
  selectedFilterKey: string;
}

function MovieIndexSearchMenuItem(props: MovieIndexSearchMenuItemProps) {
  const isSearching = useCommandExecuting(MOVIE_SEARCH);
  const { items } = useMovieIndex();

  const { isSelectMode, selectedFilterKey } = props;
  const [selectState] = useSelect();
  const { selectedState } = selectState;

  const selectedMovieIds = useMemo(() => {
    return getSelectedIds(selectedState);
  }, [selectedState]);

  const moviesToSearch =
    isSelectMode && selectedMovieIds.length > 0
      ? selectedMovieIds
      : items.map((m) => m.id);

  const searchIndexLabel =
    selectedFilterKey === 'all'
      ? translate('SearchAll')
      : translate('SearchFiltered');

  const searchSelectLabel =
    selectedMovieIds.length > 0
      ? translate('SearchSelected')
      : translate('SearchAll');

  const onPress = useCallback(() => {
    executeCommand({
      name: MOVIE_SEARCH,
      movieIds: moviesToSearch,
    });
  }, [moviesToSearch]);

  return (
    <PageToolbarOverflowMenuItem
      label={isSelectMode ? searchSelectLabel : searchIndexLabel}
      isSpinning={isSearching}
      isDisabled={!items.length}
      iconName={icons.SEARCH}
      onPress={onPress}
    />
  );
}

export default MovieIndexSearchMenuItem;
