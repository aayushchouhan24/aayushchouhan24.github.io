
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const plugins = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
  new MiniCssExtractPlugin({
    filename: './styles.css',
  }),
]

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, ''),
    filename: './bundle.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /.(html)$/,
        use: ['html-loader'],
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /.(glsl|frag|vert)$/,
        use: ['raw-loader', 'glslify-loader'],
      },
    ],
  },
  plugins: plugins,
  devServer: {
    host: 'local-ip',
    port: 3000,
    open: true,
    https: false,
    allowedHosts: 'all',
    hot: false,
  },
};
