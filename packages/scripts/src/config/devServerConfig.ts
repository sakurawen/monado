import getPort, { portNumbers } from 'get-port';
import Webpack from 'webpack';
import WebpackDevServer, { Configuration as ServerConfiguration } from 'webpack-dev-server';
import webpackBuildConfiguration from '../config/webpack.config.js';
import type { MonadoConfiguration } from '../types';
import { log } from '../utils/index.js';
import { paths } from '../utils/index.js';

const webpackDevConfiguration = async (
	monadoConf?: MonadoConfiguration
): Promise<WebpackDevServer> => {
	const defaultServePort = (monadoConf?.devServer?.port as number) || 5000;

	const port = await getPort({
		port: portNumbers(defaultServePort, defaultServePort + 1000),
	});
	const proxy = monadoConf?.devServer?.proxy;
	const config: ServerConfiguration = {
		hot: true,
		open: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*',
		},
		compress: true,
		static: {
			directory: paths.appPublicDirectory,
		},
		historyApiFallback: {
			index: '/',
			disableDotRule: true,
		},

		allowedHosts: 'all',
		port,
		proxy,
		client: {
			logging: 'error',
			overlay: {
				errors: true,
				warnings: false,
			},
		},
	};

	const compiler = Webpack(webpackBuildConfiguration(monadoConf));
	compiler.hooks.invalid.tap('invalid', () => {
		log.info('wait', 'compiling...');
	});

	compiler.hooks.done.tap('done', () => {
		log.success('ready', 'compiler successful');
	});

	compiler.hooks.failed.tap('failed', (err) => {
		log.fail('error', 'compiler failed:', err.toString());
	});

	const devSever = new WebpackDevServer(config, compiler);

	return devSever;
};

export default webpackDevConfiguration;
