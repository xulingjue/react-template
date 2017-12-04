import { connect } from 'react-redux';
import Home from '../components/Home';
import model from '../models/home';

/* eslint-disable no-unused-vars */
const mapStateToProps = state => ({
  ...state.home
});

const mapDispatchToProps = {
  // increase
  increase: model.effects.increase,
  increaseAsync: model.effects.increaseAsync,
  decrease: model.effects.decrease
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
