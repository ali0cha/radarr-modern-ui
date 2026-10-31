import React from 'react';
import {
  useNewPersonImportList,
  usePersonImportList,
} from 'Settings/ImportLists/useImportLists';
import { MovieCastPosterProps } from './Cast/MovieCastPoster';
import { MovieCrewPosterProps } from './Crew/MovieCrewPoster';

type MovieCreditPosterProps = {
  component: React.ElementType;
} & (
  | Omit<MovieCrewPosterProps, 'importList' | 'defaultImportList'>
  | Omit<MovieCastPosterProps, 'importList' | 'defaultImportList'>
);

function MovieCreditPoster({
  component: ItemComponent,
  tmdbId,
  personName,
  ...otherProps
}: MovieCreditPosterProps) {
  const importList = usePersonImportList(tmdbId);
  const defaultImportList = useNewPersonImportList(tmdbId, personName);

  return (
    <ItemComponent
      {...otherProps}
      tmdbId={tmdbId}
      personName={personName}
      importList={importList}
      defaultImportList={defaultImportList}
    />
  );
}

export default MovieCreditPoster;
