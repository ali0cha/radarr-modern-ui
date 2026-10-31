import { createStore } from 'redux';
import createReducers, { defaultState } from 'Store/Actions/createReducers';
import middlewares from 'Store/Middleware/middlewares';
import syncAdvancedSettings from './syncAdvancedSettings';

function createAppStore() {
  const appStore = createStore(
    createReducers(),
    defaultState,
    middlewares()
  );

  syncAdvancedSettings(appStore);

  return appStore;
}

export default createAppStore;
