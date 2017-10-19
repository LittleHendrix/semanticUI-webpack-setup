"use strict";

const webpack = require("webpack");
const {resolve, join} = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = require("./config");

const loaders = [
    {
        test: /\.less$/,
        include: [
            // resolve(CONFIG.paths.libpaths.npm, "semantic-ui-less"),
            config.srcPath
        ],
        // exclude: "",
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preferrence over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include
        exclude: /(node_modules|bower_components)/,
        use: ExtractTextPlugin.extract({
            fallback: {
                loader: "style-loader",
                options: {
                    sourceMap: (process.env.NODE_ENV === "development")
                }
            },
            use: [
                {
                    loader: "css-loader",
                    options: config.cssLoaderOptions
                },
                {
                    loader: "less-loader",
                    options: config.lessOptions
                }
            ],
            // override publicPath set for 'output:' in base_config
            // publicPath: "/to-new-path/example-dir/"
        })
    },
    {
        test: /\.html$/,
        include: [
            config.srcPath
        ],
        use: ["html-loader"]
    },
    {
        test: /\.(jpe?g|gif|png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: [
            resolve(config.npmPath, "semantic-ui-less"),
            resolve(config.srcPath, "images")
        ],
        use: "file-loader?name=assets/images/[name].[ext]"
    },
    {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: [
            resolve(config.npmPath, "semantic-ui-less"),
            resolve(config.srcPath, "semantic"),
            // resolve(config.srcPath, "fonts")
        ],
        use: [
            {
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "assets/fonts/"
                }
            }
        ]
    },
    {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: [
            resolve(config.npmPath, "semantic-ui-less"),
            resolve(config.srcPath, "semantic"),
            // resolve(config.srcPath, "fonts")
        ],
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 10000,
                    mimetype: "application/font-woff",
                    name: "assets/fonts/[name].[ext]"
                }
            }
        ]
    },
    {
        test: /\.(js|jsx)$/,
        // include: resolve(config.srcPath),
        exclude: [
            /(node_modules|bower_components)/
        ],
        use: [
            {
                loader: "babel-loader",
                options: config.babelSettings
            }
        ]
    }
];

const devLoaders = [
    {
        test: /\.css$/,
        include: join(config.appRoot, "docs", "docs.css"),
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
        })
    },
    {
        test: /\.js$/,
        include: join(config.appRoot, "docs"),
        use: ["script-loader"]
    }
];

const prodLoaders = [
    // {
    //     test: /\.css$/,
    //     exclude: /(node_modules|bower_components)/,
    //     loader: "ignore-loader"
    // }
];

const loadersWidthEnvSpecific = (process.env.NODE_ENV === "production") ? loaders.concat(prodLoaders) : loaders.concat(devLoaders);

module.exports = loadersWidthEnvSpecific;