import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AsyncHome from '../routes/Home';
import AsyncNotFound from '../routes/NotFound';

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={AsyncHome} />
        <Route component={AsyncNotFound} />
      </Switch>
    </BrowserRouter>
  );
};
