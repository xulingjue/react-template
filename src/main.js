import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/createStore';

// ------------------------------------
// Initialize Store
// ------------------------------------
/* eslint-disable no-underscore-dangle */
const store = createStore(window.___INITIAL_STATE__);

// ------------------------------------
// Initialize Render and mount app
// ------------------------------------
const MOUNT_NODE = document.getElementById('app');

let render = () => {
  const RootApp = require('./components/RootApp').default;
  const routes = require('./routes/index').default(store);

  ReactDOM.render(
    <RootApp store={store} routes={routes} />,
    MOUNT_NODE);
};

// ------------------------------------
// Initialize Developer Tools
//
// Only works on development
// ------------------------------------
if (process.env.NODE_ENV === 'development') {
  // Hot module replacement
  if (module.hot) {
    if (module.hot) {
      const renderApp = render;
      const renderError = (error) => {
        const RedBox = require('redbox-react').default;

        ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
      };

      render = () => {
        try {
          renderApp();
        } catch (e) {
          renderError(e);
        }
      };

      // Setup hot module replacement
      module.hot.accept([
        './routes/index'
      ], () =>
        setImmediate(() => {
          ReactDOM.unmountComponentAtNode(MOUNT_NODE);
          render();
        })
      );
    }
  }
}

render();
