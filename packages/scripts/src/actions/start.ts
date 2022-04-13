import Webpack from 'webpack';
import { webpackConfig, devServerConfig } from '../config';
import WebpackDevServer from 'webpack-dev-server';
import { files } from '../utils';
import { cleanConsole } from '../utils/console';
import chalk from 'chalk';

/**
 * 启动开发服务器
 */
const start = () => {
	process.env.NODE_ENV = 'development';
	const monadoConfig = files.loadMomadoConfig();
	console.log(monadoConfig);
	if (monadoConfig) {
		devServerConfig.port = monadoConfig.server?.port || devServerConfig.port;
	}
	const conf = webpackConfig(monadoConfig);
	const compiler = Webpack(conf);

	compiler.hooks.invalid.tap('invalid', () => {
		cleanConsole();
		console.log(chalk.blue.bold('构建中...'));
	});

	compiler.hooks.done.tap('done', () => {
		cleanConsole();
		console.log(chalk.green.bold('构建成功'));
	});

	const devServer = new WebpackDevServer(devServerConfig, compiler);
	devServer.startCallback(() => {
		cleanConsole();
	});
};

export default start;
