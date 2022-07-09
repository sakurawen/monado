import chalk from 'chalk';
import theme from './theme.js';

/**
 * 清空控制台
 */
export const clear = () => {
	process.stdout.write(
		process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
	);
};

export const success = (tag: string, ...args: string[]) => {
	console.log(chalk.hex(theme.success).bold(`[${tag}]`), ' - ', ...args);
};

export const fail = (...args: (string | Error)[]) => {
	console.log(chalk.hex(theme.error).bold('[error]'), ' - ', ...args);
};

export const warn = (...args: (string | Error)[]) => {
	console.log(chalk.hex(theme.warn).bold('[warn]'), '  - ', ...args);
};

export const info = (tag: string, ...args: string[]) => {
	console.log(chalk.hex(theme.info).bold(`[${tag}]`), '  - ', ...args);
};
