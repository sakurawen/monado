import { Command } from 'commander';
import build from './actions/build';
import { getPackageVersion } from './constants';

const program = new Command();
program.version(getPackageVersion());

program.command('build').action(() => {
	build();
});

program.command('start').action(() => {
	console.log('action:start');
});

program.parse(process.argv);
