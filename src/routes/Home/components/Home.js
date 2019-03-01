import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Home.module.less';

export default class Home extends Component {
  static propTypes = {
    increase: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    console.info('home constructor');
  }

  componentWillUnmount() {
    console.info('home unmount');
  }

  render() {
    console.info('home render: ', this.props);
    return (
      <div className={styles.container}>
        <h3 className={styles.header}>React Template</h3>
        <ul className={styles.list}>
          <li><a href="https://facebook.github.io/react/">React</a></li>
          <li><a href="https://github.com/ReactTraining/react-router">React Router3</a></li>
          <li><a href="https://www.npmjs.com/package/nmodel">NModel</a></li>
          <li><a href="https://webpack.js.org/">Webpack</a></li>
        </ul>
        <p>Count: {this.props.count}</p>
        <button onClick={() => this.props.increase()} className={styles.button}>plus</button>
        <button onClick={() => this.props.decrease()} className={styles.button}>minus</button>
      </div>
    );
  }

  increaseAsync () {
    this.props.increaseAsync().then(() => {
      console.log('so');
    });
  }
}
