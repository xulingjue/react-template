import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';

export default class RootApp extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { store, routes } = this.props;
    return (
      <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
      </Provider>
    );
  }
}
