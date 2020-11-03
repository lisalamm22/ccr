const path = require("path");

module.exports = {
  entry: "./dist/main.js",
  output: {
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", "*"],
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/],
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env"],
        },
      },
    ],
  },
};
