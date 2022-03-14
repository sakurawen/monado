import path from 'path';
import fs from 'fs';
export const AppDirectory = fs.realpathSync(process.cwd());


export const AppResolve = (resolvePath: string) =>
	path.resolve(AppDirectory, resolvePath);
