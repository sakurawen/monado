import { Configuration as ServerConfiguration } from 'webpack-dev-server';
import paths from './paths';

const devServerConfig: ServerConfiguration = {
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
		disableDotRule: true,
	},
	allowedHosts: 'all',
	port: 3670,
	client: {
		logging: 'error',
		overlay: {
			errors: true,
			warnings: false,
		},
	},
	proxy: {},
};

export default devServerConfig;
