import { connect } from 'react-redux';
import Home from '../components/Home';
import model from '../models/home';

/* eslint-disable no-unused-vars */
const mapStateToProps = state => ({
  ...state[model.namespace]
});

const mapDispatchToProps = {
  ...model.effects
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
