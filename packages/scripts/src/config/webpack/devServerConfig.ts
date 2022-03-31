import { Configuration as ServerConfiguration } from 'webpack-dev-server';
import paths from '../paths';
const devServerConfig: ServerConfiguration = {
	hot: true,
	open: true,
	host: 'localhost',
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
	port: 3670,
	client: {
		overlay: {
			errors: true,
			warnings: false,
		},
	},
	proxy: {},
};

export default devServerConfig;
