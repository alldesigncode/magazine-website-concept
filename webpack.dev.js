const { merge } = require("webpack-merge");
const common = require('./webpack.config');
const path = require('path');

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
});
