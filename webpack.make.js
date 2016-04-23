'use strict';

// Modules
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path')
var concat = require('webpack-core/lib/ConcatSource')



module.exports = function makeWebpackConfig (options) {
  /**
   * Environment type
   * BUILD is for generating minified builds
   * TEST is for generating test builds
   */
  var BUILD = !!options.BUILD;
  var TEST = !!options.TEST;
  var DEV = !TEST && !BUILD

  var config = {};

    if (TEST) {
        config.entry = {}
    } else if(DEV) {
        config.entry = {
            'index': ['./dev/app.js']
        }
    } else {
        config.entry = {
            'index': ['./src/index']
        }
    }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  if (TEST) {
    config.output = {}
  } else {
    config.output = {
      // Absolute output directory
      path: __dirname + '/lib',

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: BUILD ? './' : 'http://localhost:8080/',

      // Filename for entry points
      // Only adds hash in build mode
      filename: BUILD ? '[name].js' : '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: BUILD ? '[name].js' : '[name].bundle.js'
    }

    if(BUILD){
        config.output.libraryTarget = 'commonjs2'
        config.target = 'node'
    }
  }

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (TEST) {
    config.devtool = 'inline-source-map';
  } else if (BUILD) {
    //config.devtool = 'source-map';
  } else {
    config.devtool = 'eval';
  }



  config.module = {
    preLoaders: [],
    loaders: [{
      test: /\.js$/,
      //loader: './tools/release_loader?out=lib!babel?optional[]=runtime',
      loader: (BUILD ? 'release!' : '') + 'babel?optional[]=runtime',
      exclude: /node_modules/
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file?name=[name].[ext]'
    }, {
      test: /\.html$/,
      loader: 'html'
    },{
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          "style",
          "css?sourceMap!postcss!sass?sourceMap&sourceMapContents")
    },{
        test:/\.json$/,
        loader:'json'
    }]
  };

  if (TEST) {
    config.module.preLoaders.push({
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /\.test\.js$/
      ],
      loader: 'isparta-instrumenter'
    })
  }

  var cssLoader = {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
  };


  // Skip loading css in test mode
  if (TEST) {
    cssLoader.loader = 'null'
  }
  config.module.loaders.push(cssLoader);

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  config.postcss = [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ];


  config.plugins = [
    new ExtractTextPlugin('[name].css', {
      disable: !BUILD || TEST
    })
  ];


  if (DEV) {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './dev/index.html',
        inject: 'body',
        minify: {}
      })
  )
}

var define = new webpack.DefinePlugin({
     __DEV__: DEV,
     __LEAK__: false
 })

 if(DEV){
     config.plugins.push(define)
 }

  if (BUILD) {
    config.plugins.push(
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin()
    )
  }


  config.devServer = {
    contentBase: './public',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  };

  config.resolveLoader = {
      alias: {
          "release": path.join(__dirname, "./tools/release_loader.js")
      }
  }

  return config;
};
