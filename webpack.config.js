'use strict';

const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const ANALYZE_ENV = !!process.env.ANALYZE_ENV;

/************************************* WEBPACK CONFIG OPTIONS *************************************/
const CONFIG = require('./config/config');
const loaders = require('./config/loaders-webpack.config');
const pluginsConfig = require('./config/plugins-webpack.config')(CONFIG.env, ANALYZE_ENV);


/********************** WEBPACK DEVELOPMENT CONFIG (MERGES INTO BASE CONFIG) **********************/
/**
 * Development-specific webpack configuration (settings of keys not provided to the
 * production config, and keys with little config overlap between dev and prod).
 * @type {Object}
 */
const webpackDevOptions =
    {
        devServer: {
            open: true,
            historyApiFallback: true,
            stats: {
                assets: true,
                assetsSort: 'field',
                colors: true,
                errors: true,
                errorDetails: true,
                reasons: true,
                timings: true,
                version: true,
                warnings: true
            },
            compress: true,
            contentBase: CONFIG.paths.dist,
            host: CONFIG.host.DEV_HOST,
            port: CONFIG.port.DEV_PORT,
            inline: true,
            hot: false,
            noInfo: true,
            overlay: {
                errors: true,
                warnings: true,
            },
            watchContentBase: true
        },
        output: {
            path: CONFIG.paths.dist,
            filename: "semantic.min.js"
        },
    };

/********************** WEBPACK PRODUCTION CONFIG (MERGES INTO BASE CONFIG) ***********************/
/**
 * Production-specific webpack configuration
 * @type {Object}
 */
const webpackProdOptions =
    {
        output: {
            path: CONFIG.paths.dist,
            publicPath: "/",
            filename: "semantic.min.js"
        }
    };

/*********************************** BASE WEBPACK CONFIG OBJECT ***********************************/
/**
 * Actual webpack config object.
 * Environment-specific Webpack settings get merged into this base object.
 */
const webpackConfig =
    {
        watch: (CONFIG.env === 'development'),

        context: CONFIG.paths.root,
        entry: path.join(CONFIG.paths.src, 'index.js'),

        output: {
            path: CONFIG.paths.dist,
            filename: "semantic.min.js",
        },

        module: {
            rules: loaders
        },
        plugins: pluginsConfig,
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
            alias: {
                // point all config ref in Semantic UI source files to our local config file
                '../../theme.config$': path.join(CONFIG.paths.src, 'semantic/theme.config')
            }
        },
        performance: {
            hints: 'warning'
        },
        profile: true
    };
    // ENVIRONMENT SPECIFIC BUILD OPTIONS
    // (CONFIG.env === 'development') ? webpackDevOptions : webpackProdOptions

// module.exports = webpackConfig;

module.exports = (NODE_ENV = CONFIG.env) => {
    if (ANALYZE_ENV) {
        return webpackConfig;
    }

    if (NODE_ENV === 'production') {
        return merge(webpackConfig, webpackProdOptions, { devtool: '#source-map' });
    }

    return merge(webpackConfig, webpackDevOptions, { devtool: '#cheap-module-source-map' });
};