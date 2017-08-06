var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }
  var styleLoader = {
    loader: 'style-loader',
    options: { importLoaders: 1 }
  }

  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss', // <= this line
      plugins: () => [require('autoprefixer')()]
    }
  }
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [styleLoader,cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    // if (options.extract) {
    //   return ExtractTextPlugin.extract({
    //     use: loaders,
    //     fallback: 'vue-style-loader'
    //   })
    // } else {
      return [postcssLoader].concat(loaders)
    // }
    // return loaders
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
// exports.styleLoaders = function (options) {
//   var output = []
//   var loaders = exports.cssLoaders(options)
//   for (var extension in loaders) {
//     var loader = loaders[extension]
//     output.push({
//       test: new RegExp('\\.' + extension + '$'),
//       use: loader
//     })
//   }
//   return output
// }
//


exports.styleLoaders = function (options) {
  options = options || {}
  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: false,
      sourceMap: options.sourceMap
    }
  }
  var styleLoader = {
    loader: 'style-loader',
    options: { importLoaders: 1 }
  }

  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: () => {
        let arr = [
              require('autoprefixer')()
              ]
          if (process.env.NODE_ENV === 'production') {
            arr.push(require('cssnano')())
          }
        return arr
      }
    }
  }
  var output = [
    {
      test: /\.css$/,
      use: [styleLoader,cssLoader,postcssLoader]
    },
    {
      test: /\.scss$/,
      use: [styleLoader,cssLoader,'sass-loader',postcssLoader]
    }
  ]
  var outputprd = [
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: [cssLoader,postcssLoader],
        fallback: 'style-loader'
      })
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: [cssLoader,postcssLoader],
        fallback: 'style-loader'
      })
    }
  ]
  if (options.extract) {
    return outputprd
  } else {
    return output
  }

}
