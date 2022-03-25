import run from './utils/index.js';
import { Command } from 'commander';
import { getVersion } from './utils/package.js';

const program = new Command();

type Action = {
	alias: string;
	desc: string;
	examples: string[];
};

const actionsMap: Record<string, Action> = {
	'create <projectName>': {
		alias: 'crt',
		desc: 'create react template',
		examples: ['monado create|crt <projectName>'],
	},
	config: {
		alias: 'cfg',
		desc: 'set configuation',
		examples: ['monado config|cfg <k> <v>', 'monado config|cfg get <k>'],
	},
};

Object.keys(actionsMap).forEach((action) => {
	program
		.command(action)
		.alias(actionsMap[action].alias)
		.description(actionsMap[action].desc)
		.action((argv: string) => {
			run(argv);
		});
});

program.on('--help', () => {
	console.log('\nExamples:');
	Object.keys(actionsMap).forEach((action) => {
		actionsMap[action].examples.forEach((item) => {
			console.log('  ' + item);
		});
	});
	console.log('\n');
});

program.version(getVersion()).parse(process.argv);
