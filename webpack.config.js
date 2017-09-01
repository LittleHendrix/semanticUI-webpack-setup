const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const autoprefixBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

const babelSettings = JSON.parse(fs.readFileSync('.babelrc'));

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === "development";

const config = {
    entry: './src/index.js',
    output: {
        filename: 'semantic.min.js',
        path: path.join(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            // point all config ref in Semantic UI source files to our local config file
            '../../theme.config$': path.join(__dirname, 'src/semantic/theme.config')
        }
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                strictMath: false,
                                noIeCompat: true,
                                sourceMap: true,
                                plugins: [
                                    new LessPluginAutoPrefix({ browsers: autoprefixBrowsers })
                                ]
                            }
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
                include: path.join(__dirname, 'src'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelSettings
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }
        })
    ]
};


if (isDevelopment) {
    config.devtool = "#cheap-module-eval-source-map";
    // this handles the bundled .css output file
    config.plugins.push(
        new ExtractTextPlugin({
            filename: 'semantic.min.css'
        })
    );
}

if (isProduction) {
    config.plugins.push(
        new ExtractTextPlugin({
            filename: 'semantic.min.css'
        })
    );
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                sequences: true,
                properties: true,
                dead_code: true,
                drop_debugger: true,
                conditionals: true,
                comparisons: true,
                unused: true,
                if_return: true,
                join_vars: true,
                warnings: false
            },
            mangle: true,
            beautify: false,
            sourceMap: false,
            ie8: false,
            output: {
                comments: false
            }
        })
    );
    config.output.filename = 'semantic.min.js';
}

module.exports = config;