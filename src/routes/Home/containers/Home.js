import { connect } from 'react-redux';
import Home from '../components/Home';
import { increase } from '../modules/home';

/* eslint-disable no-unused-vars */
const mapStateToProps = state => ({
  ...state.home
});

const mapDispatchToProps = {
  increase
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
