import { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import Webpackbar from 'webpackbar';
import paths from '../paths';

const getWebpackCommonConfig = (env: { isDev: boolean }): Configuration => ({
  entry: paths.appEntry,
  target: 'web',
  output: {
    clean: true,
    filename: 'static/js/[name]-[contenthash:6].js',
    path: paths.appOutput,
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|ico|svg)$/,
        type: 'assest/resource',
        generator: {
          filename: 'static/image/[name]-[contenthash:6][ext]',
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        type: 'assest/resource',
        generator: {
          filename: 'static/font/[name]-[contenthash:6][ext]',
        },
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: require.resolve('css-loader'),
            // loader:  require.resolve('css-loader'),
            options: {
              esModule: false,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: [require.resolve('postcss-preset-env')],
              },
            },
          },
        ],
      },
      {
        test: /\.(jsx?|tsx?)$/,
        include: paths.appSrc,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              require.resolve('@babel/preset-react'),
              require.resolve('@babel/preset-typescript'),
            ],
            plugins: [
              env.isDev && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name]-[contenthash:6].css',
    }),
    new Webpackbar(),
    new HTMLWebpackPlugin({
      template: paths.appHTMLTemplate,
    }),
  ],
  cache: {
    type: 'filesystem',
  },
  optimization: {
    sideEffects: true,
    splitChunks: {
      chunks: 'all',
    },
    usedExports: true,
  },
});

export default getWebpackCommonConfig;
