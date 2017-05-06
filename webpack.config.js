var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'playscript': './index.js'
  },
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/
      })/*,
      new webpack.optimize.CommonsChunkPlugin({
        name: "playscript-deps",
        // (the commons chunk name)

        filename: "playscript-deps.js",
        // (the filename of the commons chunk)

        minChunks: function(module, count) {
          return module.resource && (/node_modules/).test(module.context);
        }
      })*/
  ],
  devServer: {
    contentBase: 'demo',
    watchOptions: {
      poll: 1000
    }
  }
};
