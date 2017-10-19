"use strict";

const NODE_ENV = process.env.NODE_ENV || "development";
const ANALYZE_ENV = !!process.env.ANALYZE_ENV;

/************************************* WEBPACK CONFIG OPTIONS *************************************/
const webpackAnalyzeConfig = require("./config/webpack_analyze_config");
const webpackDevConfig = require("./config/webpack_dev_config");
const webpackProdConfig = require("./config/webpack_prod_config");

module.exports = () => {
    if (ANALYZE_ENV) {
        return webpackAnalyzeConfig;
    }

    if (NODE_ENV === "production") {
        return webpackProdConfig;
    }

    return webpackDevConfig;
};