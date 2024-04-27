const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/memory_game.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
};
