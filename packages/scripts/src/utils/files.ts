import fs from 'fs-extra';
import { globbySync } from 'globby';
import path from 'path';
import { MonadoConfiguration } from '../types';

/**
 * 加载配置文件
 */
export const getMonadoConfiguration = (): MonadoConfiguration | undefined => {
	const files = globbySync(['**/*'], {
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

/**
 * 加载项目package.json
 */
export const getPackageJson = () => {
	const packageJson = fs.readJsonSync(
		path.resolve(process.cwd(), 'package.json')
	);
	return packageJson;
};
