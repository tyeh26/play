'use strict';

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import HostView from './components/Host';
import GuestView from './components/Guest';
import LobbyView from './components/Lobby';
import LiarsDiceView from './components/play/LiarsDice'
import NotFoundPage from './components/NotFoundPage';

const routes = (
    <Route path="/" component={Layout}>
        <IndexRoute component={GuestView} />
        <Route path="host" component={HostView} />
        <Route path="lobby" component={LobbyView} />
        <Route path="lobby/:gameId" component={LobbyView} />
        <Route path="play/liarsDice/:gameId" component={LiarsDiceView} />
        <Route path="*" component={NotFoundPage} /> // * Maps to all other pages
    </Route>
);

export default routes;