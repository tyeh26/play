import path from 'path';
import { Server } from 'http';
import Express from 'express';
import bodyParser from 'body-parser';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './src/routes';
import NotFoundPage from './src/components/NotFoundPage';
import apiRouter from './server/apiRoutes';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Parse the body of requests. MUST BE BEEFORE ROUTES.
app.use(bodyParser.urlencoded({
    extended: false
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// app.use('/static', express.static('public'))
// define the folder that will be used for static assets
app.use('/static', Express.static(path.join(__dirname, 'src/static')));

// API ROUTES
app.use('/api', apiRouter(app));


// universal routing and rendering
app.get('*', (req, res) => {
    match(
        { routes, location: req.url },
        (err, redirectLocation, renderProps) => {

            // in case of error display the error message
            if (err) {
                return res.status(500).send(err.message);
            }

            // in case of redirect propagate the redirect to the browser
            if (redirectLocation) {
                return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            }

            // generate the React markup for the current route
            let markup;
            if (renderProps) {
                const muiTheme = getMuiTheme({userAgent: req.headers['user-agent']});  
                // if the current route matched we have renderProps
                markup = renderToString(<MuiThemeProvider muiTheme={muiTheme}><RouterContext {...renderProps}/></MuiThemeProvider>);
            } else {
            // otherwise we can render a 404 page
                markup = renderToString(<NotFoundPage/>);
                res.status(404);
            }

            // render the index template with the embedded React markup
            return res.render('index', { markup });
        }
    );
});

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    console.info(`Teddy Server running on http://localhost:${port} [${env}]`);
});