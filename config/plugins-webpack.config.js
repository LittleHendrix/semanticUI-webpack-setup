const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const CONFIG = require('./config');

// Load required plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


/**
 * Plugins shared by prod and dev
 */
const basePlugins = (NODE_ENV, ANALYZE_ENV) => [
    new ExtractTextPlugin({
        filename: 'semantic.min.css'
    }),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(NODE_ENV),
            'ANALYZE_ENV': JSON.stringify(ANALYZE_ENV)
        }
    }),    
    new HtmlWebpackPlugin({
        title: 'Semantic UI theme starter kit',
        filename: 'index.html',
        inject: true, // other options are - 'head' | 'body' | false
        minify: {
            removeComments: true
        },
        hash: true, // append a unique webpack compilation hash to all included scripts and CSS files
        cache: true,
        showErrors: true
    }),
    new FaviconsWebpackPlugin({
        logo: path.join(CONFIG.paths.src, 'woodmac-logo.png'),
        prefix: 'icons-[hash]/',
        persistentCache: true,
        inject: true,
        background: '#fff',
        icons: {
            android: true,
            appleIcon: true,
            appleStartup: true,
            favicons: true,
            windows: false
        }
    }),
    // new webpack.ProvidePlugin({
    //     $: 'jquery',
    //     jQuery: 'jquery'
    // })
];

/**
 * Development-only Webpack plugins
 */
const devPlugins = [
    // new webpack.HotModuleReplacementPlugin()
];

/**
 * Production-only Webpack plugins
 */
const prodPlugins = [
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
    new CleanWebpackPlugin([CONFIG.paths.dist], {
        root: CONFIG.paths.root,
        verbose: true,
        dry: false,
        exclude: []
    })
];

/**
 * BundleAnalyzer Webpack plugins
 */
const analyzerPlugins = [
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
];

/**
 * @EXPORT
 */
module.exports = (NODE_ENV = 'development', ANALYZE_ENV = false) => {
    const plugins = basePlugins(NODE_ENV, ANALYZE_ENV)
        .concat((NODE_ENV === 'production') ? prodPlugins : [])
        .concat((NODE_ENV === 'development') ? devPlugins : [])
        .concat((ANALYZE_ENV) ? analyzerPlugins: []);

    return plugins;
}