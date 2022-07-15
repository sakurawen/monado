import { getBuildCompiler } from '../config/complier.js';
import { log } from '../utils/index.js';
import Spinner from 'ora';

/**
 * 启动打包
 */
const build = () => {
	process.env.NODE_ENV = 'production';
	const compiler = getBuildCompiler();
	const spinner = Spinner('compiled...');
	spinner.start();
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
			spinner.fail('compiled fail');
			return;
		}
		spinner.succeed('compiled successfully');
		compiler.close(() => {});
	});
};

export default build;
