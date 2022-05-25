import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import { MonadoConfiguration } from '../types';

/**
 * 加载配置文件
 */
export const loadMomadoConfig = (): MonadoConfiguration | undefined => {
	const files = globby.sync(['**/*'], {
		cwd: path.resolve(process.cwd(), '.'),
	});
	const configname = files.find(
		(filename) => filename === 'monado.config.json'
	);
	if (!configname) return undefined;
	const configPath = path.resolve(process.cwd(), configname);
	let config;
	try {
		config = fs.readJsonSync(configPath);
	} catch {
		config = undefined;
	}
	return config;
};
