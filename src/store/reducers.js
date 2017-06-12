import { combineReducers } from 'redux';
import homeReducer, { MODULE as homeReducerKey } from 'src/routes/Home/module/home';

const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...asyncReducers,
    [homeReducerKey]: homeReducer
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
