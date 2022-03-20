import { Configuration } from 'webpack';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const webpackDevConfig: Configuration = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [new ReactRefreshPlugin()],
};

export default webpackDevConfig;
