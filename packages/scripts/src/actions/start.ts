import Webpack from 'webpack';
import { webpackConfig, devServerConfig } from '../config/webpack';
import WebpackDevServer from 'webpack-dev-server';
import { file } from '../utils';

/**
 * 启动开发服务器
 */
const start = () => {
	process.env.NODE_ENV = 'development';
	const monadoConfig = file.resolveMomadoConfig();
	console.log(monadoConfig);
	if (monadoConfig) {
		devServerConfig.port = monadoConfig.server?.port || devServerConfig.port;
	}
	const conf = webpackConfig(monadoConfig);
	const complier = Webpack(conf);
	const devServer = new WebpackDevServer(devServerConfig, complier);
	devServer.startCallback(() => {});
};

export default start;
