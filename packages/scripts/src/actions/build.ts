import { webpackConfig } from '../config/webpack';
import Webpack from 'webpack';
import { file } from '../utils';

/**
 * 启动打包
 */
const build = () => {
	process.env.NODE_ENV = 'production';
	const monadoConfig = file.resolveMomadoConfig();
	const conf = webpackConfig(monadoConfig);
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
		complier.close(() => {
			console.log('complier close');
		});
	});
};

export default build;
