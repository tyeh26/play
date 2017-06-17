import React from 'react';
import { Router, browserHistory } from 'react-router';
import routes from '../routes';

// onUpdate callback just scrolls to the top of the page
// Might just delete that later
export default class AppRoutes extends React.Component {
    render() {
        return (
            <Router history={browserHistory} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>
        );
    }
}

