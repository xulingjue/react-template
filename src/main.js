import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import RootApp from './components/RootApp';

// ------------------------------------
// Initialize Store
// ------------------------------------

// ------------------------------------
// Initialize Render and mount app
// ------------------------------------
const MOUNT_NODE = document.getElementById('app');

let render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <RootApp />
    </Provider>,
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
        './components/RootApp'
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
