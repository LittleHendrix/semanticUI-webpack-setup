"use strict";

const config = require("./config");
const base_webpack_config = require("./webpack_base_config");

const webpack = require("webpack");
const merge = require("webpack-merge");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");

/********************** WEBPACK DEVELOPMENT CONFIG (MERGES INTO BASE CONFIG) **********************/
/**
 * Development-specific webpack configuration (settings of keys not provided to the
 * production config, and keys with little config overlap between dev and prod).
 * @type {Object}
 */

module.exports = merge(base_webpack_config, {
    "devtool": "#cheap-module-source-map",
    "devServer": {
        "open": true,
        "historyApiFallback": true,
        "stats": {
            "assets": true,
            "assetsSort": "field",
            "chunks": false,
            "colors": true,
            "errors": true,
            "errorDetails": true,
            "hash": true,
            "performance": true,
            "reasons": true,
            "timings": true,
            "version": true,
            "warnings": true
        },
        "compress": true,
        "contentBase": config.dev.assetsRoot,
        "host": "localhost",
        "port": config.dev.port,
        "inline": true,
        "hot": false,
        "noInfo": true,
        "overlay": {
            "errors": true,
            "warnings": false,
        },
        "watchContentBase": true
    },
    "plugins": [
        // set NODE_ENV
        new webpack.DefinePlugin({
            "process.env": config.dev.env
        }),

        // notify on succesfull build
        new WebpackBuildNotifierPlugin({ "title": "build complete" }),

        // Enable Hot module reloading
        // new webpack.HotModuleReplacementPlugin(),

        // skip the emitting phase whenever there are errors while compiling
        new webpack.NoEmitOnErrorsPlugin(),

        // recognizes certain classes of webpack errors and cleans, aggregates and prioritizes them to
        // provide a better Developer Experience
        new FriendlyErrorsPlugin()
    ]
});