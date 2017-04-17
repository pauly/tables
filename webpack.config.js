const path = require('path')
const webpack = require('webpack')

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
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebpackPlugin({
  title: process.env.npm_package_name,
  template: 'src/index.html'
})
const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin')
const inlinePlugin = new InlineChunkWebpackPlugin({
  inlineChunks: [process.env.npm_package_name]
})
const dedupePlugin = new webpack.optimize.DedupePlugin()
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
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        query: {
          presets: [
            'es2015'
          ]
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

config.output.pathinfo = true
config.output.filename = '[name].min.js'
config.plugins.unshift(dedupePlugin, uglifyPlugin)
