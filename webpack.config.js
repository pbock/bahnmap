const webpack = require('webpack');

module.exports = {
  entry: './src/assets/js/index.jsx',
  output: {
    path: './dist/assets/js/',
    publicPath: 'assets/js/',
    filename: 'index.js',
  },
  resolve: {
    modulesDirectories: [ 'node_modules', 'js', 'assets' ],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel?presets[]=react,presets[]=es2015',
      },
    ],
  },
};
