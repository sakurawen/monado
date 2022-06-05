import Webpack from 'webpack';
import { webpackConfig, devServerConfig } from '../config';
import WebpackDevServer from 'webpack-dev-server';
import { files } from '../utils';
import chalk from 'chalk';
import log from '../utils/log';

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
		log.info('wait', 'compiling...');
	});

	compiler.hooks.done.tap('done', () => {
		log.success('ready', 'compiler success');
	});

	const devServer = new WebpackDevServer(devServerConfig, compiler);

	devServer.startCallback((err) => {
		if (err) {
			console.log(chalk.red(err));
			devServer.close();
			process.exit();
		}
		const port = monadoConfig?.devServer?.port
			? monadoConfig.devServer.port
			: 5000;
		const url = chalk.cyan(`http://localhost:${port}`);
		log.success('start', `started server on  ${url}`);
	});
};

export default start;
