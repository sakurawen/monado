import { Configuration as ServerConfiguration } from 'webpack-dev-server';
import paths from '../paths';
const devServerConfig: ServerConfiguration = {
	hot: true,
	open: true,
	host: 'localhost',
	compress: true,
	static: {
		directory: paths.appPublicDirectory,
	},
	port: 5000,
};

export default devServerConfig;
