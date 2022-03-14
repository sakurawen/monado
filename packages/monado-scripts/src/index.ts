import { Command } from 'commander';
import build from './actions/build';

const program = new Command();

program.command('build').action(() => {
	console.log('action:build');
  console.log("position:",process.cwd())
	build();
});

program.command('start').action(() => {
	console.log('action:start');
});

program.parse(process.argv);
