// To generate your bundle file locally, run:
// NODE_ENV=production node_modules/.bin/webpack -p
// Then your bundle file will be in src/static/js/bundle.js

const webpack = require('webpack');
const path = require('path');

module.exports = {
    // Entry point - main JS file that initializes the application
    // Webpack then recursively reoslves all the included/imported
    // resources to determine which files go into the final bundle
    entry: path.join(__dirname, 'src', 'app-client.js'),
    output: {
      path: path.join(__dirname, 'src', 'static', 'js'),
      filename: 'bundle.js'
    },
    // module.loaders allows us to specify transformations on specific
    // files, such as using Babel with the react and es2015 presets
    // to convert all the included JS files to ES5 code
    module: {
      loaders: [{
        test: path.join(__dirname, 'src'),
        loader: ['babel-loader'],
        query: {
          cacheDirectory: 'babel_cache',
          presets: ['react', 'es2015']
        }
      }]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        mangle: true,
        sourcemap: false,
        beautify: false,
        dead_code: true
      })
    ]
};