import { combineReducers } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import actions from 'Store/Actions';

const defaultState = {};
const reducers = {};

actions.forEach((action) => {
  const section = action.section;

  defaultState[section] = action.defaultState;
  reducers[section] = action.reducers;
});

export { defaultState };

export default function() {
  // Nothing is kept in the store anymore, it is only left for what still
  // uses it until it is removed
  const reducer = Object.keys(reducers).length ?
    combineReducers(reducers) :
    (state = {}) => state;

  return enableBatching(reducer);
}
