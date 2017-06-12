import asyncComponent from 'src/utils/asyncComponent';

export default asyncComponent({
  resolve: () => import('./components/NotFound')
});
