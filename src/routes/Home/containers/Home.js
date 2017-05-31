import { connect } from 'react-redux';
import Home from '../components/Home';
import { increase, MODULE as homeReducerKey } from '../module/home';

/* eslint-disable no-unused-vars */
const mapStateToProps = state => ({
  ...state[homeReducerKey]
});

const mapDispatchToProps = {
  increase
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
