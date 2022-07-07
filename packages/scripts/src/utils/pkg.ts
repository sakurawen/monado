import fs from 'fs-extra';
import path from 'path';
import { __ } from './index.js';

/**
 * 获取版本号
 * @returns
 */
export const getVersion = () => {
	return fs.readJsonSync(path.resolve(__.dirname(), '../../package.json'))
		.version as string;
};
