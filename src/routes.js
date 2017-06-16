import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import IndexPage from './components/IndexPage';
import HostView from './components/Host';
import GuestView from './components/Guest';
import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={IndexPage} />
    <Route path="host" component={HostView} />
    <Route path="guest" component={GuestView} />
    <Route path="*" component={NotFoundPage} /> // * Maps to all other pages
  </Route>
);

export default routes;