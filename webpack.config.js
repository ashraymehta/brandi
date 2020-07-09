const slsw = require('serverless-webpack');
const {DefinePlugin} = require('webpack');

module.exports = {
  entry: slsw.lib.entries,
  mode: 'development',
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: {
    sharp: 'sharp',
  },
  plugins: [new DefinePlugin({'global.GENTLY': false})],
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  optimization: {
    usedExports: true,
  },
};
