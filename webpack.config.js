const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const autoprefixBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

const babelSettings = JSON.parse(fs.readFileSync('.babelrc'));

const config = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            // point all config ref in Semantic UI source files to our local config file
            '../../theme.config$': path.join(__dirname, 'src/semantic/theme.config')
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
                test: /\.(png|gif|jpg|jpeg|svg|ttf|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
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
                            mimetype: 'application/fontwoff'
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                include: path.join(__dirname, 'src'),
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
        // this handles the bundled .css output file
        new ExtractTextPlugin({
            filename: 'semantic.css'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })     
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: true,
            mangle: true,
            beautify: false,
            sourceMap: false,
            ie8: false
        })
    )
} else {
    config.devtool = "#cheap-module-source-map";
}

module.exports = config;