const lodash = require('lodash');
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function srcPaths(src) {
  return path.join(__dirname, src);
}

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';

// #region Common settings
const commonConfig = {
  devtool: isEnvDevelopment ? 'source-map' : false,
  mode: isEnvProduction ? 'production' : 'development',
  output: {
    path: srcPaths('dist'),
  },
  node: { __dirname: false, __filename: false, fs: 'empty' },
  resolve: {
    alias: {
      '@': srcPaths('src'),
      '@main': srcPaths('src/main'),
      '@models': srcPaths('src/models'),
      '@public': srcPaths('public'),
      '@renderer': srcPaths('src/renderer'),
      '@utils': srcPaths('src/utils'),
      'react': path.resolve('./node_modules/react')
    },
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      },
      {
        test: /\.(jpg|png|svg|ico|icns)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.(jsx?|tsx?|css)$/,
        include: path.resolve( __dirname, './' ),
        exclude: /node_modules\/(?!(bulma)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            "plugins": [
              [
                "styled-jsx/babel",
              ]
            ]
          },
        },
      },
      {
        include: path.resolve( __dirname, './' ),
        test: /\.css$/,
        use: [
            {
                // eslint-disable-next-line global-require
                loader: require('styled-jsx/webpack').loader
            }
        ]
      },
      {
        test: /\.styl$/,
        exclude: /node_modules\//,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.midi?$/,
        use: ['url-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  externals: {
    'node-hid': 'commonjs node-hid',
  },
};
// #endregion

const mainConfig = lodash.cloneDeep(commonConfig);
mainConfig.entry = './src/main/main.ts';
mainConfig.target = 'electron-main';
mainConfig.output.filename = 'main.bundle.js';
mainConfig.plugins = [
  new CopyPkgJsonPlugin({
    remove: ['scripts', 'devDependencies', 'build'],
    replace: {
      main: './main.bundle.js',
      scripts: { start: 'electron ./main.bundle.js' },
      postinstall: 'electron-builder install-app-deps',
    },
  }),
];

const rendererConfig = lodash.cloneDeep(commonConfig);
rendererConfig.entry = './src/renderer/renderer.tsx';
rendererConfig.target = 'electron-renderer';
rendererConfig.output.filename = 'renderer.bundle.js';
rendererConfig.plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './public/index.html'),
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: 'static' }],
  }),
];

const pluginConfig = lodash.cloneDeep(commonConfig);
pluginConfig.entry = {
  background: './src/plugin/background.ts',
  content: './src/plugin/content.tsx',
};

module.exports = [mainConfig, rendererConfig, pluginConfig];