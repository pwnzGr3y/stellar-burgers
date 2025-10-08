const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve(__dirname, './src/index.tsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.module\.css$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|svg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new Dotenv()
  ],
  resolve: {
    extensions: [
      '.*',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.css',
      '.scss',
      '.png',
      '.svg',
      '.jpg'
    ],
    alias: {
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@ui-pages': path.resolve(__dirname, './src/components/ui/pages'),
      '@utils-types': path.resolve(__dirname, './src/utils/types'),
      '@api': path.resolve(__dirname, './src/utils/burger-api'),
      '@slices': path.resolve(__dirname, './src/services/slices'),
      '@selectors': path.resolve(__dirname, './src/services/selectors'),
      '@index.css': path.resolve(__dirname, './src/index.css'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@images': path.resolve(__dirname, './src/images'),
      '@ui-pages/*': path.resolve(__dirname, './src/components/ui/pages/*'),
      '@slices/crystal-gateway-slice': path.resolve(__dirname, './src/services/slices/crystal-gateway-slice'),
      '@slices/fusion-assembler-slice': path.resolve(__dirname, './src/services/slices/fusion-assembler-slice'),
      '@slices/quantum-materials-slice': path.resolve(__dirname, './src/services/slices/quantum-materials-slice'),
      '@slices/phoenix-transactions-slice': path.resolve(__dirname, './src/services/slices/phoenix-transactions-slice'),
      '@slices/aurora-stream-slice': path.resolve(__dirname, './src/services/slices/aurora-stream-slice'),
      '@slices/dragon-history-slice': path.resolve(__dirname, './src/services/slices/dragon-history-slice')
    }
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  devServer: {
    static: path.join(__dirname, './dist'),
    compress: true,
    historyApiFallback: true,
    port: 4000
  }
};
