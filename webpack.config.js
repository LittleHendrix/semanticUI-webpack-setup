const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const CONFIG = require('./config/config');
const parts = require('./config/webpack.parts');

const analyze = !!process.env.ANALYZE_ENV;

const commonConfig = merge([
    {
        entry: path.join(CONFIG.PATHS.src, 'index.js'),
        output: {
            path: CONFIG.PATHS.dist,
            filename: 'semantic.min.js'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            alias: {
                // point all config ref in Semantic UI source files to our local config file
                '../../theme.config$': path.join(CONFIG.PATHS.src, 'semantic/theme.config')
            }
        },
    },    
    parts.extractCSS({
        filename: 'semantic.min.css',
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
    }),
    parts.loadImages(),
    parts.loadFonts(),
    parts.loadJs({
        include: CONFIG.PATHS.src,
        use: [
            {
                loader: 'babel-loader',
                options: CONFIG.babelSettings
            }
        ]
    }),
    parts.loadCommonPlugins()
]);

const analyzeConfig = merge([
    parts.loadAnalyzer()
]);

const devConfig = merge([
    parts.devServer({
        contentBase: CONFIG.PATHS.dist,
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 8080
    })
]);

const prodConfig = merge([
    parts.loadProductionPlugins()
]);

module.exports = (env = CONFIG.env) => {
    if (analyze) {
        return merge(commonConfig, analyzeConfig);
    }

    if (env === 'production') {
        return merge(commonConfig, prodConfig);
    }

    return merge(commonConfig, devConfig);
}