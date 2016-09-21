var webpack = require('webpack');
var baseConfig = require('./webpack.config.dev.js');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = Object.create(baseConfig);

config.devtool = 'source-map';
config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: { warnings: false },
  }),
  new HtmlWebpackPlugin({
    title: 'WELCOME SON',
    
  })
];
config.output.filename = "farmbot-production.min.js"
module.exports = config;
