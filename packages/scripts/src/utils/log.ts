import chalk from 'chalk';

/**
 * 清空控制台
 */
export const clear = () => {
	process.stdout.write(
		process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
	);
};

export const success = (tag: string, ...args: string[]) => {
	console.log(chalk.hex('#10b981').bold(`[${tag}]`), ' - ', ...args);
};

export const fail = (...args: (string | Error)[]) => {
	console.log(chalk.hex('#ef4444').bold('[error]'), ' - ', ...args);
};

export const warn = (...args: (string | Error)[]) => {
	console.log(chalk.hex('#f59e0b').bold('[warn]'), '  - ', ...args);
};

export const info = (tag: string, ...args: string[]) => {
	console.log(chalk.hex('#3b82f6').bold(`[${tag}]`), '  - ', ...args);
};
