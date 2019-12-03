const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  context: __dirname,
//   entry: ['./src/index.ts', './src/styles.scss'],
  entry: './src/index.ts',
  resolve: {
    modules: [path.resolve(__dirname, 'dist'), 'node_modules'],
    extensions: [ '.tsx', '.ts', '.js', '.scss', '.css' ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ef',
    libraryTarget: 'umd'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
            loader: 'ts-loader',
            options: {
                transpileOnly: true
            }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer(),
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false
  },
  devServer: {
    contentBase: ['demo'],
    inline: true,
    noInfo: true,
  },
};
