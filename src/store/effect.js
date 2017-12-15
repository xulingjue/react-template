import invariant from 'invariant';
import { prefixed } from './prefixed';

export function getEffects (store, model = {}) {
  if (!model.effects || !Object.keys(model.effects).length) return {};
  let effects = {};
  Object.keys(model.effects).forEach(key => {
    effects[key] = wrapEffect(model.effects[key]);
  });

  return effects;

  function wrapEffect (handler) {
    return (...args) => {
      return (dispatch, getState) => {
        args = args || [];
        args.push({ put, dispatch, getState, update });
        return handler.apply(null, args);

        // dispatch an action
        function put (action) {
          invariant(action && action.type, `${model.name}: action should be a plain object`);
          action.type = prefixed(model.namespace, action.type);
          dispatch(action);
        }

        // direct update state
        function update (state) {
          const globalState = store.getState();
          let currentState = globalState[model.namespace];
          currentState = Object.assign({}, currentState, state);

          store.dispatch({
            type: prefixed(model.namespace, '@@update'),
            state: currentState
          });
        }
      }
    };
  }
}
