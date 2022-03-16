import { Command } from 'commander';
import { getPackageVersion } from './constants';
import build from './actions/build';
import start from './actions/start';

const program = new Command();
program.version(getPackageVersion());

program.command('build').action(() => {
	build();
});

program.command('start').action(() => {
	start();
});

program.parse(process.argv);
