const path = require('path')
const MicroversePlugin = require('@microverse-network/webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin, IgnorePlugin } = require('webpack')

const babelOptions = {
  babelrc: true,
  cacheDirectory: true,
  presets: [
    require.resolve('babel-preset-env'),
    require.resolve('babel-preset-stage-0'),
  ],
}

const mode = process.env.WEBPACK_SERVE
  ? 'development'
  : process.env.NODE_ENV || 'development'

module.exports = {
  entry: ['babel-polyfill', 'subworkers', './index.js'],
  output: {
    path: path.join(__dirname, '.microverse'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    symlinks: true,
  },
  mode,
  module: {
    rules: [
      {
        test: /\.microverse|workerize\.js$/,
        use: [
          {
            loader: '@microverse-network/webworker-loader',
            options: { publicPath: '/.microverse/' },
          },
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelOptions,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(mode) } }),
    new IgnorePlugin(/microverse\.json/),
    new MicroversePlugin({ config: path.join(__dirname, './microverse.json') }),
  ],
  node: {
    dgram: 'empty',
    net: 'empty',
    fs: 'empty',
  },
}
