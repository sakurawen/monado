import path from 'path';
import { fs } from 'zx';

/**
 * 获取包版本
 */
export const getVersion = () => {
	const version = fs.readJsonSync(path.resolve('package.json'))
		.version as string;
	return version;
};
