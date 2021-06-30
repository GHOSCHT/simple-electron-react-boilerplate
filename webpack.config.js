const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = (env, argv) => {
  const nodeModules = {};
  fs.readdirSync("node_modules")
    .filter((x) => [".bin"].indexOf(x) === -1)
    .forEach((mod) => {
      nodeModules[mod] = `commonjs ${mod}`;
    });

  return {
    entry: "./src/index.tsx",
    output: {
      path: path.join(__dirname, "build"),
      filename: "index.bundle.js",
    },
    mode: process.env.NODE_ENV || "development",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    devServer: { contentBase: path.join(__dirname, "src") },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.(css|scss)$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
          use: ["file-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
      }),
      new ForkTsCheckerWebpackPlugin(),
      {
        apply: (compiler) => {
          compiler.hooks.done.tap("DonePlugin", () => {
            if (argv.mode === "production") {
              setTimeout(() => {
                process.exit(0);
              });
            }
          });
        },
      },
    ],
    watch: true,
    target: "electron-renderer",
    externals: nodeModules,
  };
};
