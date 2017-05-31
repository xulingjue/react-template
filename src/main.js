import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/createStore';
import App from './containers/App';

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

let render = () => {
  ReactDOM.render(<App store={store} />, MOUNT_NODE);
};

// ------------------------------------
// Initialize Developer Tools
//
// Only works on development
// ------------------------------------
if (process.env.NODE_ENV === 'development') {
  // Hot module replacement
  if (module.hot) {
    const renderApp = render;
    const renderError = (error) => {
      // Show app error
      const RedBox = require('redbox-react').default;

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };

    module.hot.accept('./containers/App', () => {
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render();
      });
    });
  }
}

render();
