const path = require('path');
const { resolve } = require('path')

module.exports = {
  context: __dirname,
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: false
  },
  resolve: {
    modules: [resolve(__dirname, 'dist'), 'node_modules'],
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ef'
  },
  devServer: {
    contentBase: ['demo'],
    inline: true,
    noInfo: true,
  },
};
