var webpack = require('webpack');

module.exports = {
  entry: './src/app/app.js',

  output: {
    path: __dirname + '/dist',
    filename: 'app.min.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader']
      },

      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  },

  plugins: [new webpack.optimize.UglifyJsPlugin()]
};
