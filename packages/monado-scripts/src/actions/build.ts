import WebpackCommonConfig from '../config/webpack.common.js';
import Webpack from 'webpack';

const build = () => {
	const complier = Webpack(WebpackCommonConfig);
	complier.run((err, stats) => {
		stats?.toJson('minimal');
		if (err) console.log(err);
		if (stats?.hasErrors()) {
			console.log(new Error('Build failed with errors.'));
			console.log('错误：', stats.toString());
		}
		if (stats?.hasWarnings()) {
			console.warn(stats.hasWarnings());
		}
	});
};

export default build;
