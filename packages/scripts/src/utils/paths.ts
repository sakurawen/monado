import path from 'path';
import fs from 'fs';
import globby from 'globby';

// 应用根文件夹
export const AppDirectory = fs.realpathSync(process.cwd());

/**
 *
 * @param resolvePath 解析路径
 * @returns
 */
const resolveApp = (resolvePath: string) =>
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
  AppDirectory,
	app: resolveApp('.'),
	appNodeModules: resolveApp('node_modules'),
	appWebpackCache: resolveApp('node_modules/.cache'),
	appEntry: resolveApp(`src/${resolveAppEntryName()}`),
  appPostCssConfig:resolveApp("postcss.config.js"),
	appOutput: resolveApp('dist'),
	appPublicDirectory: resolveApp('public'),
	AppTailwindcssConfig: resolveApp('tailwind.config.js'),
	AppTSConfig: resolveApp('tsconfig.json'),
	appSrc: resolveApp('src'),
	appHTMLTemplate: resolveApp('public/index.html'),
};
