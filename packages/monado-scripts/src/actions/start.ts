import Webpack from 'webpack';
import { webpackConfig, webpackDevConfig } from '../config/webpack';
import WebpackDevServer from 'webpack-dev-server';
import { merge } from 'webpack-merge';

const devServerConfig = {
	hot: true,
	open: true,
	host: 'localhost',
	port: 5000,
};

/**
 * 启动开发服务器
 */
const start = () => {
	process.env.NODE_ENV = 'development';
	const conf = merge(webpackConfig(), webpackDevConfig);
	const complier = Webpack(conf);
	const devServer = new WebpackDevServer(devServerConfig, complier);
	devServer.startCallback(() => {
		console.log('start!');
	});
};

export default start;
