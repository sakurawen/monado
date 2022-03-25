import Webpack from 'webpack';
import { webpackConfig, devServerConfig } from '../config/webpack';
import WebpackDevServer from 'webpack-dev-server';
import { file } from '../utils';

/**
 * 启动开发服务器
 */
const start = () => {
	process.env.NODE_ENV = 'development';
	const config = file.resolveMomadoConfig();
	if (config) {
		devServerConfig.port = config.port;
	}
	const conf = webpackConfig();
	const complier = Webpack(conf);
	const devServer = new WebpackDevServer(devServerConfig, complier);
	devServer.startCallback(() => {});
};

export default start;
