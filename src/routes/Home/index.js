export default store => ({
  path: '/home',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Home = require('./containers/Home').default;

      cb(null, Home);
    }, 'home');
  }
});
