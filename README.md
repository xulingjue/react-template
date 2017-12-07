# React Template

> A template with react + redux + react-router3 + webpack

## Installation
```bash
$ git clone https://github.com/gcfeng/react-template.git <my-project-name>
$ cd <my-project-name>
```

When that's done, install the project dependencies. It's recommended that you use [Yarn](#https://yarnpkg.com/) for
deterministic dependency management, but `npm install` will suffice.

```bash
$ yarn # or use `npm install`
```

If `npm install` is slowly, you can use npm mirror
```bash
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
$ cnpm install
```

## Running the project
After completing the [installation](#installation) step, you are ready to start the project!
```bash
$ yarn start # Start the development server (or `npm start`)
```

All available commands:

| `yarn <script>` or `npm run <script>` | Description |
|---------------------------------------|-------------|
| `start` | start dev server, default listen to 8080, support HRM |
| `start:prod` | start dev server serve files after build |
| `build:prod` | build project and output to `dist/` |

## Project structure
```
|- build                          # webpack build script
|- config                         # project config
|- server                         # development server
|- src
    |- components                 # components
    |- layouts                    # page layouts
    |- routes                     # pages
        |- components
        |- containers
        |- models
        |- index.js
    |- services                   # handle module service logic
    |- static                     # static files
    |- assets                     # global assets, such as images
    |- store                      # redux store
    |- index.html
    |- main.js                    # entry
```

The redux boilerplate is very boring. To implement a feature, we have to define actions, reducers and constants. For 
convenience, we wrap this into model. A model is just like:

```js
import { model } from 'src/store/store';

export default model({
  // namespace is required and need to be unique
  namespace: 'home',

  // state of the module
  state: {
    count: 0,
    loading: false
  },

  // side effects, just like actions
  // ease effects will be injected below methods:
  // - put(action): dispatch an action, the action type corresponds to reducers
  // - dispatch(action): dispatch an action, the action type must prefixed with namespace, such as 'namespace/actionName'
  // - update(state): update state directly
  // - getState(): get global state 
  effects: {
    increase ({ put }) {
      put({ type: 'actionName', payload: '' });
    },
    
    increaseAsync ({ update }) {
      update({ loading: true });
      someApi().then(() => {}).catch(() => {}).then(() => {
        update({ loading: false });
      });
    }    
  },

  // reducers
  reducers: {
    actionName (state, action) {
      return {...state, state};
    }
  }
});
```
