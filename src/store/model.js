import invariant from 'invariant';
import { getReducer, injectReducer } from './reducer';
import { getEffects } from './effect';

export default (store) => {
  let models = [];

  return (model) => {
    invariant(model && Object.keys(model), 'model should be a plain object');
    invariant(model.namespace, 'namespace should be specific');
    const m = models.find(m => m.namespace === model.namespace);
    if (m) return false;

    let _model = {
      namespace: model.namespace,
      reducers: getReducer(model),
      effects: getEffects(store, model)
    };

    injectReducer(store, { key: _model.namespace, reducer: _model.reducers });

    return _model;
  };
}
