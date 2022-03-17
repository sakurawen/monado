import { Configuration } from 'webpack';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const webpackProdConfiguration: Configuration = {
  mode: 'production',
  devtool: false,
  plugins: [new CssMinimizerPlugin()],
};

export default webpackProdConfiguration;
