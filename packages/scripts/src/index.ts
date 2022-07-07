import { Command } from 'commander';
import { pkg } from './utils/index.js';
import build from './actions/build.js';
import start from './actions/start.js';

const program = new Command();

program.version(pkg.getVersion(), '-v');
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
