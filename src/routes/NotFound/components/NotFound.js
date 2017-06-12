import React from 'react';

export default class NotFound extends React.Component {
  constructor(props) {
    super(props);
    console.info('not found cons');
  }

  render() {
    console.info('notfound render');
    return <div>Not Found</div>;
  }
}
