import { Configuration as ServerConfiguration } from 'webpack-dev-server';
import { paths } from '../utils';

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
		index: '/',
		disableDotRule: true,
	},
  
	allowedHosts: 'all',
	port: 5000,
	client: {
		logging: 'error',
		overlay: {
			errors: true,
			warnings: false,
		},
	},
};

export default devServerConfig;
