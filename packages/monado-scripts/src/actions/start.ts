import Webpack from 'webpack';
import { webpackConfig, devServerConfig } from '../config/webpack';
import WebpackDevServer from 'webpack-dev-server';

/**
 * 启动开发服务器
 */
const start = () => {
	process.env.NODE_ENV = 'development';
	const conf = webpackConfig();
	const complier = Webpack(conf);
	const devServer = new WebpackDevServer(devServerConfig, complier);
	devServer.startCallback();
};

export default start;
