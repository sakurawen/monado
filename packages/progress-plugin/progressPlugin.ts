import chalk from 'chalk';
import ora, { Ora } from 'ora';
import webpack, { Stats } from 'webpack';

const theme = {
	success: '#10b981',
	error: '#ef4444',
	warn: '#f59e0b',
	info: '#3b82f6',
};

/**
 * 打包进度提示
 */
class ProcessPlugin extends webpack.ProgressPlugin {
	spinner: Ora | null = ora('Compiled...').start();
	running = true;
	startTime = 0;
	status = {
		message: '',
		hasErrors: false,
	};

	constructor() {
		const progressPluginHandler = (
			percentage: number,
			msg: string,
			info: string
		) => {
			const percent = Math.ceil(percentage * 100);
			if (this.spinner) {
				this.spinner.text = `${chalk.hex(theme.success)(
					'[Monado Scripts]'
				)} - ${msg} [${percent}%]\n  ${chalk.gray(info)}`;
			}
			this.spinner?.render();
			if (percentage >= 1) {
				this.spinner?.stop();
				this.printResult();
				// 防止再次改变状态
				this.spinner = null;
				this.running = false;
			}
		};
		super(progressPluginHandler);
	}

	apply = (compiler: webpack.Compiler) => {
		super.apply(compiler);

		compiler.hooks.done.tap('done', (stats) => {
			const s = stats as Stats;
			if (!this.running) return;
			const hasErrors = s.hasErrors();
			Object.assign(this.status, {
				message: hasErrors ? 'with some errors' : 'successfully',
				hasErrors,
			});
		});

		compiler.hooks.compile.tap('startTime', () => {
			this.startTime = Date.now();
		});
	};

	printResult = () => {
		const { hasErrors, message } = this.status;
		const time = ((Date.now() - this.startTime) / 1000).toFixed(2);
		if (hasErrors) {
			this.spinner?.fail(
				chalk.hex(theme.error)(`Compiled ${message} in ${time}s`)
			);
			return;
		}
		this.spinner?.succeed(
			chalk.hex(theme.success)(`Compiled ${message} in ${time}s`)
		);
	};
}

export default ProcessPlugin;
