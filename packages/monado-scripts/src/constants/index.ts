import fs from 'fs-extra';
import path from 'path';

/**
 * 获取包版本号
 * @returns
 */
export const getPackageVersion = () => {
	return fs.readJsonSync(path.resolve(__dirname, '../../package.json'))
		.version as string;
};
