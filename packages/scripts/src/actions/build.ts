import { webpackConfig } from '../config/webpack';
import Webpack from 'webpack';
import { files } from '../utils';

/**
 * 启动打包
 */
const build = () => {
	process.env.NODE_ENV = 'production';
	const monadoConfig = files.loadMomadoConfig();
	const conf = webpackConfig(monadoConfig);
	const complier = Webpack(conf);
	complier.run((err, stats) => {
		stats?.toJson('minimal');
		if (err) {
			console.error('build error:', err);
		}
		if (stats?.hasWarnings()) {
			console.warn(stats.hasWarnings());
		}
		if (stats?.hasErrors()) {
			console.error(new Error('Build failed with errors.'));
			console.error('stats has error:', stats.toString());
			return;
		}
		complier.close(() => {
			console.log('complier close');
		});
	});
};

export default build;
