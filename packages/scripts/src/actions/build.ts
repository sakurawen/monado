import { getBuildCompiler } from '../config/complier.js';
import { log } from '../utils/index.js';

/**
 * 启动打包
 */
const build = () => {
	process.env.NODE_ENV = 'production';
	const compiler = getBuildCompiler();
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
