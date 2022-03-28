import path from 'path';
import { fileURLToPath } from 'url';
import { fs } from 'zx';

/**
 * 获取包版本
 */
export const getVersion = () => {
	const version = fs.readJsonSync(
		path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../package.json')
	).version as string;
	return version;
};
