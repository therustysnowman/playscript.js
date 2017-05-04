var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'playscript': './lib/playscript.js',
    'playscriptEditor': './apps/editor/app.js',
    'playscriptExecutor': './apps/executor/app.js',
    'playscriptWidgets': './widgets/library.js'
  },
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          'html-loader'
        ]
      }
    ]
  },
  plugins: [
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "playscriptDep",
        // (the commons chunk name)

        filename: "playscriptDep.js",
        // (the filename of the commons chunk)

        minChunks: function(module, count) {
          return module.resource && (/node_modules/).test(module.context);
        }

        // minChunks: 3,
        // (Modules must be shared between 3 entries)

        // chunks: ["pageA", "pageB"],
        // (Only use these entries)
      })
  ],
  devServer: {
    contentBase: 'demo',
    watchOptions: {
      poll: 1000
    }
  }
};
