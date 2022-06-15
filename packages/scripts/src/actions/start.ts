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
