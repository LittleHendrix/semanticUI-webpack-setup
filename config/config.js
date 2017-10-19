"use strict";

const webpack = require("webpack");
const {resolve} = require("path");

const LessPluginAutoPrefix = require("less-plugin-autoprefix");
const autoprefixBrowsers = ["last 2 versions", "> 1%", "opera 12.1", "bb 10", "android 4"];

const appRoot = resolve(__dirname, "..");

module.exports = {
    "appRoot": appRoot,
    "srcPath": resolve(appRoot, "src"),
    "npmPath": resolve(appRoot, "node_modules"),
    "bowerPath": resolve(appRoot, "bower_components"),
    "build": {
        "env": require("./env_prod"),
        "assetsRoot": resolve(appRoot, "dist"),
        "assetsPublicPath": "/",
        "productionGzipExtensions": ["js", "css"],
    },
    "dev": {
        "env": require("./env_dev"),
        "port": 9999,
        "assetsRoot": resolve(appRoot, "development"),
        "assetsPublicPath": "http://localhost:9999/"
    },
    "cssLoaderOptions": {
        "minimize": process.env.NODE_ENV === "production",
        "sourceMap": true
    },
    "lessOptions": {
        "strictMath": false,
        "noIeCompat": true,
        "sourceMap": true,
        "plugins": [
            new LessPluginAutoPrefix({ browsers: autoprefixBrowsers })
        ]
    },
    "babelSettings": {
        "cacheDirectory": true,
        "presets": ["es2015"]
    }
}