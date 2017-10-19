"use strict";

const webpack = require("webpack");
const { join } = require("path");
const config = require("./config");
const loaders = require("./webpack_loaders_config");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");


module.exports = {
    "cache": true,
    "watch": (process.env.NODE_ENV === "development"),
    "context": config.appRoot,
    "entry": {
        "app": join(config.srcPath, "index.js"),
        // "vendor": ["react", "react-dom", "jquery"]
    },
    "target": "web",
    // externals: ["react"],
    // Don"t follow/bundle these modules, but request them at runtime from the environment
    stats: {
        assets: true,
        assetsSort: "field",
        chunks: false,
        colors: true,
        errors: true,
        errorDetails: true,
        hash: true,
        performance: true,
        timings: true,
        warnings: true
    },
    output: {
        filename: (process.env.NODE_ENV === "production")
            ? "bundle.min.js" // alt. "[name].js",
            : "bundle.js",
        path: (process.env.NODE_ENV === "production")
            ? config.build.assetsRoot
            : config.dev.assetsRoot,
        publicPath: (process.env.NODE_ENV === "production")
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath,
        pathinfo: (process.env.NODE_ENV !== "production")
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
        alias: {
            // point all config ref in Semantic UI source files to our local config file
            "../../theme.config$": join(config.srcPath, "semantic/theme.config")
        }
    },
    module: {
        rules: loaders
    },
    plugins: [
        new ExtractTextPlugin({
            filename: (process.env.NODE_ENV === "production")
                ? "semantic.min.css"
                : "semantic.css",
            allChunks: true
        }),
        new ImageminPlugin({
            disable: (process.env.NODE_ENV === "development"), // Disable during development
            // optipng: null,
            // svgo: null,
            // jpegtran: null,
            // pngquant: null,
            // gifsicle: null,
            // gifsicle: {
            //     interlaced: false,
            //     optimizationLevel: 1 // Select an optimization level between 1 (fast) and 3 (better results).
            // },
            // pngquant: {
            //     quality: "75-90",
            //     speed: 4 // from 1 (brute-force) to 10 (fastest). Speed 10 has 5% lower quality, but is 8 times faster than the default.
            // },
            plugins: [
                imageminMozjpeg({
                    quality: 75,
                    progressive: true
                })
            ]
        }),
        // Generate HTML on the fly.
        // All chunks created by webpack will be automatically injected
        // If you already have a template file and want to use your own, specify the path on the template property.
        new HtmlWebpackPlugin({
            "template": join(config.srcPath, "index.html"),
            "title": "Semantic UI - WoodMac theme",
            "filename": "index.html",
            "inject": "head", // other options are - "head" | "body" | true | false
            "minify": (process.env.NODE_ENV === "development")
                ? false
                : {
                    collapseInlineTagWhitespace: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true, // Always collapse to 1 space (never remove it entirely). Must be used in conjunction with collapseWhitespace=true
                    minifyCSS: true,
                    minifyJS: true,
                    preserveLineBreaks: true,
                    removeComments: true,
                    removeScriptTypeAttributes: true, //Remove type="text/javascript" from script tags.
                    removeStyleLinkTypeAttributes: true //Remove type="text/css" from style and link tags. 
                },
            "hash": true, // append a unique webpack compilation hash to all included scripts and CSS files
            "cache": true,
            "showErrors": true
        }),
        new FaviconsWebpackPlugin({
            logo: join(config.srcPath, "images", "woodmac-logo.png"),
            prefix: "icons-[hash]/",
            persistentCache: true,
            inject: (process.env.NODE_ENV === "development"), // Inject the html into the html-webpack-plugin (in dev mode only)
            background: "#fff",
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                favicons: true,
                firefox: false,
                windows: false
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jquery': 'jquery'
        })
    ],
    performance: {
        hints: "warning"
    },
    profile: true
}