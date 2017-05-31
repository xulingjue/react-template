import { injectReducer } from 'src/store/reducers';
import homeReducer, { MODULE as homeReducerKey } from './module/home';
import Home from './containers/Home';

export function bindReducer(store) {
  injectReducer(store, { key: homeReducerKey, reducer: homeReducer });
}

export default Home;
