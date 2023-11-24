/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  target: 'node',
  optimization: {
    minimize: false
  },
  devtool: 'source-map',
  stats: {
    preset: 'summary',
    modules: true,
    modulesSpace: 50,
    modulesSort: 'size'
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    mainFields: ['main', 'module'],
    alias: {
      '@latitude55/libs': path.resolve(__dirname, 'src/libs'),
      '@latitude55/modules': path.resolve(__dirname, 'src/modules'),
      '@latitude55/types': path.resolve(__dirname, 'src/types'),
      '@latitude55/middleware': path.resolve(__dirname, 'src/middleware')
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: 'tsconfig.json'
            }
          }
        ]
      }
    ]
  },
  externals: ['pg', 'pg-format'],
  plugins: [new ForkTsCheckerWebpackPlugin()]
};
