const webpack = require('webpack');
const Define = webpack.DefinePlugin;
const Clean = require('clean-webpack-plugin');
const Html = require('html-webpack-plugin');

const sass = require('sass');
const Fiber = require('fibers');

const path = x => (require('path')).resolve(__dirname, '..', ...x.split('/'));

const env = process.env.NODE_ENV || 'development';
const publicFolder = path('public');

module.exports = {
  entry: {
    remark: './src/app/app.jsx',
    counters: './src/widgets/counters/app',
    'last-comments': './src/widgets/last-comments/app',
    demo: './src/demo/demo',
  },
  output: {
    path: publicFolder,
    filename: `[name].js`,
  },
  resolve: {
    extensions: ['.jsx', '.js'],
    modules: [
      path('src'),
      path('node_modules'),
    ],
    alias: {
      react: path('./node_modules/preact-compat'),
      'react-dom': path('./node_modules/preact-compat'),
    },
  },
  resolveLoader: {
    alias: {
      'scss-vars-loader': path('config/loaders/scss-vars-loader'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: [
            'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers: ['> 1%', 'android >= 4.4.4', 'ios >= 9'],
                }),
                require('postcss-url')({
                  url: 'inline',
                  maxSize: 5,
                }),
              ],
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              fiber: Fiber,
              sourceMap: true,
              includePaths: [path('src')],
            },
          },
          'scss-vars-loader',
        ],
      },
    ],
  },
  plugins: [
    new Clean(publicFolder),
    new Define({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    new webpack.ProvidePlugin({
      Component: ['preact', 'Component'],
      b: 'bem-react-helper',
    }),
    new Html({
      template: path('src/demo/index.ejs'),
      inject: false,
    }),
  ],
};
