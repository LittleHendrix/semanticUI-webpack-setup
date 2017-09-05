'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CONFIG = require('./config');

const loaders = [
    {
        test: /\.less$/,
        include: [
            // path.resolve(CONFIG.paths.libpaths.npm, 'semantic-ui-less'),
            CONFIG.paths.src
        ],
        // exclude: '',
        use: ExtractTextPlugin.extract({
            use: [
                {
                    loader: 'css-loader',
                    options: CONFIG.cssLoaderOptions
                },
                {
                    loader: 'less-loader',
                    options: CONFIG.lessOptions
                }
            ]
        })
    },
    {
        test: /\.(jpe?g|gif|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader?name=assets/images/[name].[ext]'
    },
    {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: 'assets/fonts/[name].[ext]'
                }
            }
        ]
    },
    {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                    name: 'assets/fonts/[name].[ext]'
                }
            }
        ]
    },
    {
        test: /\.(js|jsx)$/,
        include: CONFIG.paths.src,
        // exclude: [
        //     CONFIG.paths.libpaths.npm,
        //     CONFIG.paths.libpaths.bower
        // ],
        use: [
            {
                loader: 'babel-loader',
                options: CONFIG.babelSettings
            }
        ]
    }
];

const devLoaders = [];

const loadersWidthEnvSpecific = (CONFIG.env === 'production') ? loaders : loaders.concat(devLoaders);

module.exports = loadersWidthEnvSpecific;