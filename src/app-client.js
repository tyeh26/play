import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppRoutes from './components/AppRoutes';

const App = () => (
    <MuiThemeProvider>
        <AppRoutes />
    </MuiThemeProvider>
);

window.onload = () => {
    ReactDOM.render(<App />, document.getElementById('main'));
};