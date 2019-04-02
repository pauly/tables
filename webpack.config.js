const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin')

const env = process.env.NODE_ENV || 'development'

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify(env),
    'npm_package_name': JSON.stringify(process.env.npm_package_name),
    'npm_package_version': JSON.stringify(process.env.npm_package_version),
    'domain': JSON.stringify(process.env.domain),
    'npm_package_config_port': process.env.npm_package_config_port
  }
})

const inlinePlugin = new InlineChunkWebpackPlugin({
  inlineChunks: ['game']
})

const htmlPlugin = new HtmlWebpackPlugin({
  title: process.env.npm_package_name,
  // excludeChunks: ['game'],
  template: 'src/index.html'
})

const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    properties: true,
    sequences: true,
    dead_code: true,
    conditionals: true,
    comparisons: true,
    evaluate: true,
    booleans: true,
    unused: true,
    loops: true,
    hoist_funs: true,
    cascade: true,
    if_return: true,
    join_vars: true,
    drop_debugger: true,
    unsafe: true,
    hoist_vars: true,
    negate_iife: true
  },
  sourceMap: true,
  mangle: {
    toplevel: false,
    sort: false,
    eval: false,
    props: {
      regex: /^_/ // only mangle properties that start with underscore
    }
  },
  output: {
    space_colon: false,
    comments: false
  }
})

const config = module.exports = {
  context: __dirname,

  entry: {
    game: './src/game'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  },

  output: {
    filename: '[name].min.js',
    sourceMapFilename: '[name].map',
    path: path.resolve('./docs'),
    publicPath: './'
  },

  plugins: [definePlugin, htmlPlugin, inlinePlugin],

  recordsPath: path.resolve('/tmp/webpack.json')
}

if (process.env.NODE_ENV === 'production') {
  config.output.pathinfo = true
  config.output.filename = '[name].min.js'
  config.plugins.unshift(uglifyPlugin)
}
