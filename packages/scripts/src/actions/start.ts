import Webpack from 'webpack';
import { webpackConfig, devServerConfig } from '../config';
import WebpackDevServer from 'webpack-dev-server';
import { files } from '../utils';
import chalk from 'chalk';

/**
 * 启动开发服务器
 */
const start = () => {
	process.env.NODE_ENV = 'development';
	const monadoConfig = files.loadMomadoConfig();
	if (monadoConfig) {
		devServerConfig.port = monadoConfig.devServer?.port || devServerConfig.port;
		devServerConfig.proxy = monadoConfig.devServer?.proxy || undefined;
	}
	const conf = webpackConfig(monadoConfig);
	const compiler = Webpack(conf);

	compiler.hooks.invalid.tap('invalid', () => {
		console.log(chalk.blue.bold('compiling...'));
	});

	compiler.hooks.done.tap('done', () => {
		console.log(chalk.green.bold('compiler success'));
	});

	const devServer = new WebpackDevServer(devServerConfig, compiler);

	devServer.startCallback(() => {});
};

export default start;
