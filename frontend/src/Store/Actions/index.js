import * as addMovie from './addMovieActions';
import * as app from './appActions';
import * as calendar from './calendarActions';
import * as captcha from './captchaActions';
import * as customFilters from './customFilterActions';
import * as discoverMovie from './discoverMovieActions';
import * as importMovie from './importMovieActions';
import * as interactiveImportActions from './interactiveImportActions';
import * as movieCollections from './movieCollectionActions';
import * as movieFiles from './movieFileActions';
import * as oAuth from './oAuthActions';
import * as providerOptions from './providerOptionActions';
import * as releases from './releaseActions';
import * as system from './systemActions';

export default [
  addMovie,
  app,
  calendar,
  captcha,
  customFilters,
  discoverMovie,
  movieFiles,
  importMovie,
  interactiveImportActions,
  oAuth,
  providerOptions,
  releases,
  movieCollections,
  system
];
