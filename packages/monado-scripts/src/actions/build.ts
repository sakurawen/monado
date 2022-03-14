import WebpackCommonConfig from '../config/webpack.common.js';
import Webpack from 'webpack';

const build = () => {
	const complier = Webpack(WebpackCommonConfig);
	complier.run((err, stats) => {
		stats?.toJson('minimal');
		if (err) {
			console.error('build error:', err);
		}
		if (stats?.hasErrors()) {
			console.error(new Error('Build failed with errors.'));
			console.error('stats has error：', stats.toString());
		}
		if (stats?.hasWarnings()) {
			console.warn(stats.hasWarnings());
		}
	});
};

export default build;
