import React from 'react';

// https://github.com/ctrlplusb/react-async-component
export default (config) => {
  const {
    name,
    resolve,
    LoadingComponent,
    ErrorComponent
  } = config;

  const sharedState = {
    // This will be used to hold the resolved module allowing sharing across instances.
    // NOTE: When using React Hot Loader this reference will become null.
    mod: null,
    // If an error occurred during a resolution it will be stored here.
    error: null,
    // Allows us to share the resolver promise across instances.
    resolver: null
  };

  // Takes the given module and if it has a '.default', the '.default' will be returned.
  const es6Resolve = (m) => {
    return m !== null && (typeof m === 'function' || typeof m === 'object') && m.default ? m.default : m;
  };

  const getResolver = () => {
    if (sharedState.resolver === null) {
      try {
        // Always return Promise
        const resolver = resolve();
        sharedState.resolver = Promise.resolve(resolver);
      } catch (err) {
        sharedState.resolver = Promise.reject(err);
      }
    }
    return sharedState.resolver;
  };

  class AsyncComponent extends React.Component {
    static displayName = name || 'AsyncComponent';

    constructor(props) {
      super(props);

      this.state = {
        mod: null,
        error: null
      };
    }

    componentWillMount() {
      this.setState({ mod: sharedState.mod });
      if (sharedState.error) {
        this.registerErrorState(sharedState.error);
      }
    }

    componentDidMount() {
      if (!this.state.mod) {
        this.resolveModule();
      }
    }

    componentWillUnmount() {
      this.unmounted = true;
    }

    resolveModule() {
      this.resolving = true;

      return getResolver().then((mod) => {
        if (this.unmounted) return undefined;
        sharedState.mod = mod;
        this.setState({ mod });
        this.resolving = false;
        return mod;
      }).catch((error) => {
        if (this.unmounted) return undefined;
        sharedState.error = error;
        this.registerErrorState(error);
        this.resolving = false;
        return undefined;
      });
    }

    registerErrorState(error) {
      setTimeout(() => {
        if (!this.isMounted) {
          this.setState({ error });
        }
      }, 16);
    }

    render() {
      const { mod, error } = this.state;
      if (sharedState.mod === null && !this.resolving) {
        this.resolveModule();
      }
      if (error) {
        return ErrorComponent
          ? <ErrorComponent {...this.props} error={error} />
          : null;
      }
      const Component = es6Resolve(mod);
      return Component
        ? <Component {...this.props} />
        : LoadingComponent ? <LoadingComponent {...this.props} /> : null;
    }
  }

  return AsyncComponent;
};
