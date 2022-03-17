import path from 'path';
import fs from 'fs';
import globby from 'globby';

export const AppDirectory = fs.realpathSync(process.cwd());

const AppResolve = (resolvePath: string) =>
	path.resolve(AppDirectory, resolvePath);

/**
 * 解析应用入口文件名
 * 优先级
 * 文件名 index>main
 * 后缀 .tsx>.ts>.jsx>.js
 */
const resolveAppEntryName = () => {
	const files = globby.sync(['**/*'], {
		cwd: path.resolve(process.cwd(), 'src'),
	});
	const entryName = files.find((filename) => {
		return (
			filename === 'index.tsx' ||
			filename === 'index.ts' ||
			filename === 'main.tsx' ||
			filename === 'main.ts' ||
			filename === 'index.jsx' ||
			filename === 'index.js' ||
			filename === 'main.jsx' ||
			filename === 'main.js'
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
