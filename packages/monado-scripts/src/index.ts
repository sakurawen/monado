import { Command } from 'commander';
import { getPackageVersion } from './constants';
import build from './actions/build';
import start from './actions/start';

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
