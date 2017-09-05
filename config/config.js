const webpack = require('webpack');
const path = require('path');

const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const autoprefixBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

module.exports = {
    PATHS: {
        root: path.join(__dirname, '..'),
        src: path.join(__dirname, '..', 'src'),
        dist: path.join(__dirname, '..', 'dist'),
        libPaths: path.join(__dirname, '..', 'node_modules')
    },
    env: process.env.NODE_ENV || 'development',
    host: {
        DEV_HOST: 'localhost',
    },
    port: {
        DEV_PORT: 8080
    },
    cssLoaderOptions: {
        sourceMap: true
    },
    lessOptions: {
        strictMath: false,
        noIeCompat: true,
        sourceMap: true,
        plugins: [
            new LessPluginAutoPrefix({ browsers: autoprefixBrowsers })
        ]
    },
    babelSettings: {
        presets: ['es2015']
    }
}