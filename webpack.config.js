const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
    utils: [
        './src/utils/config.js',
        './src/utils/constant.js',
        './src/utils/microfront.js',
        './src/utils/store.js',
        './src/utils/web-component.js'
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
        template: './index.html',
    }),

    new ModuleFederationPlugin({})
  ],

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  module: {
    rules: [
      // Regla para cargar archivos CSS
      {
        test: /\.css$/,
        include: /styles/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  devServer: {
    port: 8000,
    historyApiFallback: true,
    proxy: {
        '/angular16': {
          target: 'http://localhost:4200',
          pathRewrite: { '^/angular16': '' },
        }
     }
  }
};
