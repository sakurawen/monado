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
	create: {
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
		.action(() => {
			run(action);
		});
});

program.on('--help', () => {
	console.log('Examples:');
	Object.keys(actionsMap).forEach((action) => {
		actionsMap[action].examples.forEach((item) => {
			console.log('  ' + item);
		});
	});
});

program.version(getVersion()).parse(process.argv);
