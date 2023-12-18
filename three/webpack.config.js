
  const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const plugins = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
  new MiniCssExtractPlugin({
    filename: './styles.css',
  }),
]

const fs = require('fs')
const publicDirectory = path.resolve(__dirname, 'public')
if (fs.existsSync(publicDirectory) && fs.readdirSync(publicDirectory).length > 0) {
  plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' },
      ],
    })
  )
}

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
        test: /.(jpg|png|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext]',
        },
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
    watchFiles: ['src/**', 'public/**'], 
    static: {
      watch: true,
      directory: path.join(__dirname, 'public'), 
    },
  },
};
  