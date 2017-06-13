import { injectReducer } from 'src/store/reducers';

export default store => ({
  path: '/home',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Home = require('./containers/Home').default;
      const reducer = require('./modules/home').default;

      injectReducer(store, { key: 'home', reducer });

      cb(null, Home);
    }, 'home');
  }
});
