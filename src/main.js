import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import createStore from './store/createStore';
import RootApp from './components/RootApp';

// ------------------------------------
// Initialize Store
// ------------------------------------
/* eslint-disable no-underscore-dangle */
const initialState = window.___INITIAL_STATE__;
const store = createStore(initialState);

// ------------------------------------
// Initialize Render and mount app
// ------------------------------------
const MOUNT_NODE = document.getElementById('app');

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    MOUNT_NODE);
};

render(RootApp);

// ------------------------------------
// Initialize Developer Tools
//
// Only works on development
// ------------------------------------
if (process.env.NODE_ENV === 'development') {
  // Hot module replacement
  if (module.hot) {
    module.hot.accept('./components/RootApp', () => {
      render(RootApp);
    });
  }
}
