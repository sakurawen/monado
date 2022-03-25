import fs from 'fs-extra';
import path from 'path';

/**
 * 获取版本号
 * @returns
 */
export const getVersion = () => {
	return fs.readJsonSync(path.resolve(__dirname, '../../package.json'))
		.version as string;
};
