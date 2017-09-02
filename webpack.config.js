const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const autoprefixBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

const babelSettings = JSON.parse(fs.readFileSync('.babelrc'));

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === "development";

const analyze = !!process.env.ANALYZE_ENV;
const env = process.env.NODE_ENV || 'development';

const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist')
}

const config = {
    entry: path.join(PATHS.src, 'index.js'),
    output: {
        filename: 'semantic.min.js',
        path: PATHS.dist
    },
    devServer: {
        inline: true,
        contentBase: PATHS.dist,
        compress: true,
        host: 'localhost',
        port: 9000,
        overlay: {
            warning: true,
            errors: true
        },
        watchContentBase: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            // point all config ref in Semantic UI source files to our local config file
            '../../theme.config$': path.join(PATHS.src, 'semantic/theme.config')
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
                include: PATHS.src,
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
                'NODE_ENV': JSON.stringify(env)
            }
        }),
        // this handles the bundled .css output file
        new ExtractTextPlugin({
            filename: 'semantic.min.css'
        })
    ]
};

if (analyze) {
    config.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8888,
            reportFilename: 'report.html',
            // Should be one of `stat`, `parsed` or `gzip`. 
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            // Log level. Can be 'info', 'warn', 'error' or 'silent'. 
            logLevel: 'info'
        })
    );
}

if (isDevelopment) {
    config.devtool = '#cheap-module-eval-source-map';
    config.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
                context: __dirname
            }
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
    config.plugins.push(
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|html)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    );
    config.output.filename = 'semantic.min.js';
}

module.exports = config;