import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
/**
 * 解析配置文件
 */
export const resolveMomadoConfig = () => {
	const files = globby.sync(['**/*'], {
		cwd: path.resolve(process.cwd(), '.'),
	});
	const configname = files.find((filename) => filename === 'monado.config.json');
	if (!configname) return;
	const configPath = path.resolve(process.cwd(), configname);
	const config = fs.readJsonSync(configPath);
	console.log('config:', config);
};
