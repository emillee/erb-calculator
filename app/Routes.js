import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import CalculatorPage from './containers/CalculatorPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.CALCULATOR} component={CalculatorPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
