var path = require('path'),
    exec = require('child_process').exec,
    execSync = require('child_process').execSync,
    webpack = require('webpack');
var StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

exec("rm app-resources/*bundle.js* app-resources/*styles.css*"); // Clean previous stuff.

var revisionPlugin = new webpack.DefinePlugin({
    'process.env.REVISION': JSON.stringify(execSync('git log --pretty=format:"%h%n%ad%n%f" -1').toString()),
});

module.exports = function() {
    return {
        module: {
            loaders: [{
                    test: /\.tsx?$/,
                    exclude: /(node_modules)/,
                    loader: 'ts'
                },
                {
                    test: /\.hbs$/,
                    loader: 'handlebars-loader'
                }
            ],
        },
        entry: {
            'app-resources/bundle': './src/entry.tsx',
            // Preprocesses an HTML file to figure out if we need to load
            // style.css or not.
            'app-index': './src/static/app_index.ts',
            'front_page': './src/front_page/index.tsx'
        },
        output: {
            path: "public",
            filename: "[name].js",
            libraryTarget: 'umd',
        },
        ts: {
            configFileName: "tsconfig.json"
        },
        plugins: [
            revisionPlugin,
            new StaticSiteGeneratorPlugin("app-index", "/app/", {
                templateName: "app_index"
            })
        ],
        resolve: {
            extensions: ['', '.js', '.ts', '.tsx', '.hbs'],
            fallback: path.join(__dirname, 'node_modules'),
            alias: {
                // Satisfies Handlebars requirement for 'fs' module.
                'handlebars': 'handlebars/runtime.js'
            }
        },
        node: {
            // Satisfies Handlebars requirement for 'fs' module.
            fs: "empty"
        },
        devServer: {
            historyApiFallback: {
                index: '/index.html',
                rewrites: [
                    { from: /\/app/, to: '/app/index.html' }
                ]
            },
        }
    };
};