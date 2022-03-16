import path from 'path';
import fs from 'fs';
export const AppDirectory = fs.realpathSync(process.cwd());
import globby from 'globby';

const AppResolve = (resolvePath: string) =>
	path.resolve(AppDirectory, resolvePath);

/**
 * 解析应用入口文件名
 */
const resolveAppEntryName = () => {
	const files = globby.sync(['**/*'], {
		cwd: path.resolve(process.cwd(), 'src'),
	});
	const entryName = files.find((filename) => {
		return (
			filename.includes('index.tsx') ||
			filename.includes('index.ts') ||
			filename.includes('main.tsx') ||
			filename.includes('main.ts') ||
			filename.includes('index.jsx') ||
			filename.includes('index.js') ||
			filename.includes('main.jsx') ||
			filename.includes('main.js')
		);
	});
	return entryName || 'index.tsx';
};

export default {
	appEntry: AppResolve(`src/${resolveAppEntryName()}`),
	appOutput: AppResolve('dist'),
	appPublicDirectory: AppResolve('public'),
	appSrc: AppResolve('src'),
	appHTMLTemplate: AppResolve('public/index.html'),
};
