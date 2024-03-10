const fs = require("fs");

if (
  !process.versions.node.startsWith(
    fs.readFileSync("./.nvmrc").toString().trim(),
  )
) {
  throw new Error("invalid node version");
}

const nodeEnv = process.env.NODE_ENV;

if (!nodeEnv) {
  throw new Error("you must specific NODE_ENV");
}

const isDev = nodeEnv == "development";

const babelOptions = {
  presets: [
    "react",
    [
      "es2015",
      {
        modules: false,
      },
    ],
    "es2016",
  ],
};

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: babelOptions,
          },
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  devServer: {
    server: "https",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new (require("html-bundler-webpack-plugin"))({
      entry: {
        index: "./src/index.html",
      },
      js: {
        filename: "js/[name].[contenthash:8].js",
      },
      css: {
        filename: "css/[name].[contenthash:8].css",
      },
    }),
    isDev && new (require("@pmmmwh/react-refresh-webpack-plugin"))(),
  ].filter(Boolean),
};
