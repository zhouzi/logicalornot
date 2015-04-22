var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/app.js',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.min.js'
  },

  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src'),
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [new webpack.optimize.UglifyJsPlugin()]
};
