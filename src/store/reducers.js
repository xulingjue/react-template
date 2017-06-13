import { combineReducers } from 'redux';
import appReducer from './app';

const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...asyncReducers,
    app: appReducer
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
