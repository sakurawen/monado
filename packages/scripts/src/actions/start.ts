import chalk from 'chalk';
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { devServerConfig, webpackConfig } from '../config/index.js';
import { files, log, theme } from '../utils/index.js';

/**
 * 启动开发服务器
 */
const start = () => {
	process.env.NODE_ENV = 'development';
	const monadoConfig = files.loadConfig();
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
		log.success('ready', 'compiler successful');
	});

	compiler.hooks.failed.tap('failed', (err) => {
		log.fail('error', 'compiler failed:', err.toString());
	});

	const devServer = new WebpackDevServer(devServerConfig, compiler);

	devServer.startCallback((err) => {
		if (err) {
			console.log(chalk.hex(theme.error)(err));
			devServer.close();
			process.exit();
		}
		log.clear();
		const port = monadoConfig?.devServer?.port
			? monadoConfig.devServer.port
			: 5000;

		const url = chalk.hex('#10b981').bold(`http://localhost:${port}`);

		const host = chalk
			.hex('#10b981')
			.bold(`http://${WebpackDevServer.internalIPSync('v4')}:${port}`);

		console.log('');
		log.success(
			'start',
			`started server\n\n You can now open a browser to view the project \n\n Local:           ${url}\n On Your Network: ${host}\n`
		);
	});
};

export default start;
