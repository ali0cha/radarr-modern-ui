import * as addMovie from './addMovieActions';
import * as app from './appActions';
import * as calendar from './calendarActions';
import * as captcha from './captchaActions';
import * as commands from './commandActions';
import * as customFilters from './customFilterActions';
import * as discoverMovie from './discoverMovieActions';
import * as importMovie from './importMovieActions';
import * as interactiveImportActions from './interactiveImportActions';
import * as movies from './movieActions';
import * as movieCollections from './movieCollectionActions';
import * as movieFiles from './movieFileActions';
import * as movieIndex from './movieIndexActions';
import * as oAuth from './oAuthActions';
import * as providerOptions from './providerOptionActions';
import * as releases from './releaseActions';
import * as system from './systemActions';

export default [
  addMovie,
  app,
  calendar,
  captcha,
  commands,
  customFilters,
  discoverMovie,
  movieFiles,
  importMovie,
  interactiveImportActions,
  oAuth,
  providerOptions,
  releases,
  movies,
  movieCollections,
  movieIndex,
  system
];
