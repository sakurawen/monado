import {
	getWebpackCommonConfig,
	webpackProdConfiguration,
} from '../config/webpack';
import Webpack from 'webpack';
import { merge } from 'webpack-merge';

/**
 * 启动打包
 */
const build = () => {
	const conf = merge(
		getWebpackCommonConfig({ isDev: false }),
		webpackProdConfiguration
	);
	const complier = Webpack(conf);
	complier.run((err, stats) => {
		stats?.toJson('minimal');
		if (err) {
			console.error('build error:', err);
		}
		if (stats?.hasErrors()) {
			console.error(new Error('Build failed with errors.'));
			console.error('stats has error:', stats.toString());
		}
		if (stats?.hasWarnings()) {
			console.warn(stats.hasWarnings());
		}
	});
};

export default build;
