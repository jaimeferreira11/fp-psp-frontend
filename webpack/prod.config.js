const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./base.config.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin('css/main.[contenthash].css');

module.exports = merge(baseConfig, {
  debug: false,
  watch: false,
  output: {
    path: __dirname,
    filename: '[name].[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: extractSass.extract(['css', 'sass'])
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/vendor.[chunkhash].js'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['vendor', 'js/main'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/login.html',
      chunks: ['vendor', 'js/login_main'],
      filename: 'login.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    extractSass
  ]
});
