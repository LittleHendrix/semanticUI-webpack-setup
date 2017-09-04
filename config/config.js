const webpack = require('webpack');
const path = require('path');

module.exports = {
    PATHS: {
        src: path.join(__dirname, '..', 'src'),
        dist: path.join(__dirname, '..', 'dist')
    },
    env: process.env.NODE_ENV || 'development'
}