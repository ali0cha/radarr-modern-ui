import React, { useCallback, useMemo } from 'react';
import { useSelect } from 'App/SelectContext';
import { REFRESH_MOVIE } from 'Commands/commandNames';
import { executeCommand, useCommandExecuting } from 'Commands/useCommands';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import { icons } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import { useMovieIndex } from './useMovieIndex';

interface MovieIndexRefreshMovieButtonProps {
  isSelectMode: boolean;
  selectedFilterKey: string | number;
}

function MovieIndexRefreshMovieButton(
  props: MovieIndexRefreshMovieButtonProps
) {
  const isRefreshing = useCommandExecuting(REFRESH_MOVIE);
  const { items, totalItems } = useMovieIndex();

  const { isSelectMode, selectedFilterKey } = props;
  const [selectState] = useSelect();
  const { selectedState } = selectState;

  const selectedMovieIds = useMemo(() => {
    return getSelectedIds(selectedState);
  }, [selectedState]);

  const moviesToRefresh =
    isSelectMode && selectedMovieIds.length > 0
      ? selectedMovieIds
      : items.map((m) => m.id);

  const refreshIndexLabel =
    selectedFilterKey === 'all'
      ? translate('UpdateAll')
      : translate('UpdateFiltered');

  const refreshSelectLabel =
    selectedMovieIds.length > 0
      ? translate('UpdateSelected')
      : translate('UpdateAll');

  const onPress = useCallback(() => {
    executeCommand({
      name: REFRESH_MOVIE,
      movieIds: moviesToRefresh,
    });
  }, [moviesToRefresh]);

  return (
    <PageToolbarButton
      label={isSelectMode ? refreshSelectLabel : refreshIndexLabel}
      isSpinning={isRefreshing}
      isDisabled={!totalItems}
      iconName={icons.REFRESH}
      onPress={onPress}
    />
  );
}

export default MovieIndexRefreshMovieButton;
