import MainLayout from 'src/layouts/MainLayout/MainLayout';
import HomeRoute from './Home';
import NotFound from './NotFound';

export const createRoutes = store => ({
  path: '/',
  component: MainLayout,
  indexRoute: {
    onEnter(nextState, replace) {
      replace('/home');
    }
  },
  childRoutes: [
    HomeRoute(store),
    NotFound(store)
  ]
});

export default createRoutes;
