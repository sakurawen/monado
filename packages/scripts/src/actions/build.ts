import Webpack from 'webpack';
import { webpackConfig } from '../config/index.js';
import { files, log } from '../utils/index.js';

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
			log.fail('Compiled error:', err);
		}
		if (stats?.hasWarnings()) {
			console.warn(stats.hasWarnings());
		}
		if (stats?.hasErrors()) {
			log.fail('stats has error:', stats.toString());
			return;
		}
		compiler.close(() => {});
	});
};

export default build;
