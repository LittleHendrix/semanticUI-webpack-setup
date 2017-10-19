"use strict";

const config = require("./config");
const base_webpack_config = require("./webpack_base_config");

const webpack = require("webpack");
const merge = require("webpack-merge");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

/********************** WEBPACK PRODUCTION CONFIG (MERGES INTO BASE CONFIG) ***********************/
/**
 * Production-specific webpack configuration
 * @type {Object}
 */
module.exports = merge(base_webpack_config, {
    "plugins": [

        // set env
        new webpack.DefinePlugin({
            "process.env": config.build.env
        }),

        new webpack.optimize.UglifyJsPlugin({
            "compress": {
                "sequences": true,
                properties: true,
                "dead_code": true,
                "drop_debugger": true,
                "conditionals": true,
                "comparisons": true,
                "unused": true,
                "if_return": true,
                "join_vars": true,
                "warnings": false
            },
            "mangle": true,
            "beautify": false,
            "sourceMap": true,
            "ie8": false,
            "output": {
                "comments": false
            }
        }),

        // notify on succesfull build
        new WebpackBuildNotifierPlugin({ "title": "build complete" }),

        // skip the emitting phase whenever there are errors while compiling
        new webpack.NoEmitOnErrorsPlugin(),

        // GZIP the files
        new CompressionWebpackPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp(
                "\\.(" + config.build.productionGzipExtensions.join("|") + ")$"
            ),
            threshold: 10240,
            minRatio: 0.8
        }),

        new CleanWebpackPlugin([config.build.assetsRoot], {
            root: config.appRoot,
            verbose: true,
            dry: false,
            exclude: []
        })
    ]
});