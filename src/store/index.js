import { createStore } from 'nmodel';
import { createLogger } from 'redux-logger';

/* configure middlewares */
const logger = createLogger({
  collapsed: true
});
const middlewares = [
  logger
];

export const store = createStore(window.__INITIAL_STATE__, middlewares);
