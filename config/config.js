const webpack = require('webpack');
const path = require('path');

const fs = require('fs');

const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const autoprefixBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];


const babelSettings = JSON.parse(fs.readFileSync('./.babelrc'));

module.exports = {
    PATHS: {
        root: path.join(__dirname, '..'),
        src: path.join(__dirname, '..', 'src'),
        dist: path.join(__dirname, '..', 'dist')
    },
    env: process.env.NODE_ENV || 'development',
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
    babelSettings: babelSettings
}