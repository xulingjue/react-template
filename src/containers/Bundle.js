import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BundleNotFound from './BundleNotFound';

/**
 * Dynamic load page
 */
export default class RouteBundle extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    source: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      mod: null
    };
  }

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source !== this.props.source) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({
      mod: null
    });
    import(`src/routes/${props.source}`).then((mod) => {
      // dynamic inject reducer
      if (typeof mod.bindReducer === 'function') {
        mod.bindReducer(this.props.store);
      }
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      });
    }).catch(() => {
      this.setState({
        mod: BundleNotFound
      });
    });
  }

  render() {
    if (!this.state.mod) {
      return null;
    }
    return React.createElement(this.state.mod, this.props);
  }
}
