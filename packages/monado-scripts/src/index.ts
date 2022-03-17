import { Command } from 'commander';
import { getPackageVersion } from './constants';
import build from './actions/build.js';
import start from './actions/start.js';
const program = new Command();
program.version(getPackageVersion());
program
	.command('build')
	.description('构建应用')
	.action(() => {
		build();
	});

program
	.command('start')
	.description('启动开发服务器')
	.action(() => {
		start();
	});

program.parse(process.argv);
