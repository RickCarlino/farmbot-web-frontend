var open = require('open');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    loaders: [{
      test: /\.tsx?$/,
      exclude: /(bower_components|node_modules)/,
      loader: 'ts'
    }],
  },
  entry: {
    app: './src/entry.tsx'
  },
  output: {
    path: path.resolve(__dirname, "..", "dist"),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  ts: {
    configFileName: "tsconfig.json"
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }), new HtmlWebpackPlugin()
  ],
  resolve: {
    extensions: [
      '',
      '.js',
      '.ts',
      '.tsx'
    ],
  },
  devServer: {
    historyApiFallback: {
      index: 'default.html',
    }
  }
};

open('http://localhost:8080/app/login');
