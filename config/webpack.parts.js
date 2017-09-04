const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

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

exports.loadJs = () => {
    
    const babelSettings = JSON.parse(fs.readFileSync('.babelrc'));

    return {
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include: CONFIG.PATHS.src,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelSettings
                        }
                    ]
                }
            ]
        }
    }
};

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
        plugins: [ plugin ]
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