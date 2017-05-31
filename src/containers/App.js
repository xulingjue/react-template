import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Bundle from './Bundle';

export default class App extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  renderRoute(source, props) {
    return <Bundle {...props} store={this.props.store} source={source} />;
  }

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <BrowserRouter>
          {/* Stop looking for matches when has route matches  */}
          <Switch>
            <Route path='/' exact render={this.renderRoute.bind(this, 'Home/index.js')} />
            <Route render={this.renderRoute.bind(this, 'NotFound/index.js')} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}
