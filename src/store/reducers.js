import { combineReducers } from 'redux';
import appReducer, { MODULE as appReducerKey } from './app';

const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    [appReducerKey]: appReducer,
    ...asyncReducers
  });
};

/**
 * Dynamic inject reducer when page is dynamic loaded
 */
export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
