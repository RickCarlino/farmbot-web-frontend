var webpack = require('webpack');
var I18nPlugin = require("i18next-webpack-plugin");
var generateConfig = require("./webpack.config.base");


var languages = {
  "en": null,
  // In development mode, we don't want to spend a lot of time
  // compiling every possible language. We will just use a subset
  // of all i18n packs.
  "de": require("./languages/de.json")
};

module.exports = Object.keys(languages).map(function (language) {
  var conf = generateConfig(language);

  conf
    .plugins
    .push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }));

  conf
    .plugins
    .push(new I18nPlugin(languages[language]));

  return conf;
});