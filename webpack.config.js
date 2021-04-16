const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      minify: {
        minifyCSS: true,
        minifyJS: true,
      },
      data: { // arbitrary data
        title: "Layout Design",
        apiContext: "testcontext",
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset"
      },
      {
        test: /\.(svg)$/i,
        type: "asset/source"
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
};
