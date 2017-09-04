const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const CONFIG = require('./config');

exports.devServer = ({ contentBase, host, port } = {}) => ({
    devServer: {
        historyApiFallback: true,
        stats: 'errors-only',
        compress: true,
        contentBase, // 'dist'
        host, // Defaults to 'localhost'
        port, // Defaults to 8080
        overlay: {
            errors: true,
            warnings: true,
        },
        overlay: {
            warning: true,
            errors: true
        },
        watchContentBase: true
    },
});

exports.loadCommonPlugins = () => ({
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(CONFIG.env)
            }
        }),
        new HtmlWebpackPlugin({
            title: 'Semantic UI theme starter kit',
            filename: 'index.html',
            inject: true
        }),
        new FaviconsWebpackPlugin({
            logo: path.join(CONFIG.PATHS.src, 'woodmac-logo.png'),
            prefix: 'icons-[hash]/',
            persistentCache: true,
            inject: true,
            background: '#fff',
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
    ]
});

exports.loadProductionPlugins = () => ({
    plugins: [
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
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|html)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new CleanWebpackPlugin([CONFIG.PATHS.dist], {
            root: CONFIG.PATHS.root,
            verbose: true,
            dry: false,
            exclude: []
        })
    ]
});

exports.loadJs = ({ include, exclude, use } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include,
                use
            }
        ]
    }
});

exports.extractCSS = ({ filename, include, exclude, use } = {}) => {
    const plugin = new ExtractTextPlugin({
        filename
    });

    return {
        module: {
            rules: [
                {
                    test: /\.less$/,
                    include,
                    exclude,
                    use: plugin.extract({
                        use
                    })
                }
            ]
        },
        plugins: [plugin]
    };

};

exports.loadImages = () => ({
    module: {
        rules: [
            {
                test: /\.(jpe?g|gif|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader?name=assets/images/[name].[ext]'
            }
        ]
    }
});

exports.loadFonts = () => ({
    module: {
        rules: [
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
            }
        ]
    }
});

exports.loadAnalyzer = () => ({
    plugins: [
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
    ]
});