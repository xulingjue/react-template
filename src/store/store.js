import { applyMiddleware, compose, createStore as createReduxStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { makeRootReducer } from './reducer';
import createModel from './model';

function createStore (initialState = {}) {
  /* configure middlewares */
  const logger = createLogger({
    collapsed: true
  });
  const middlewares = [
    thunk,
    /* logger must be the last middleware */
    logger
  ];

  /* enhance store */
  const enhancers = [];
  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  /* hot module replacement */
  const store = createReduxStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middlewares),
      ...enhancers
    )
  );
  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const reducer = require('./reducer').default;
      store.replaceReducer(reducer(store.asyncReducers));
    });
  }

  return store;
}

export const store = createStore(window.__INITIAL_STATE__);
export const model = createModel(store);
