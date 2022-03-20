import create from '../actions/create.js';
import ora from 'ora';
import chalk from 'chalk';

function run(arg: string) {
	const spinner = ora(chalk.green('loading...'));
	spinner.start();
	setTimeout(() => {
		spinner.succeed('run successful');
		console.log('result:', arg);
		create();
	}, 2000);
}

export default run;
