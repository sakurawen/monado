import Webpack from 'webpack';
import { webpackConfig } from '../config';
import { files, log } from '../utils';

/**
 * 启动打包
 */
const build = () => {
	process.env.NODE_ENV = 'production';
	const monadoConfig = files.loadConfig();
	const conf = webpackConfig(monadoConfig);
	const compiler = Webpack(conf);
	compiler.run((err, stats) => {
		stats?.toJson('minimal');
		if (err) {
			log.fail('build error:', err);
		}
		if (stats?.hasWarnings()) {
			console.warn(stats.hasWarnings());
		}
		if (stats?.hasErrors()) {
			log.fail('build failed with errors.');
			log.fail('stats has error:', stats.toString());
			return;
		}
		compiler.close(() => {
			log.success('ready', 'build successfully');
		});
	});
};

export default build;
