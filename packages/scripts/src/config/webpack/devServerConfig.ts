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
	historyApiFallback: true,
	port: 3670,
	client: {
		overlay: {
			errors: true,
			warnings: false,
		},
	},
  proxy:{
  }
};

export default devServerConfig;
