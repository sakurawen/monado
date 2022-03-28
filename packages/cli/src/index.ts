import { Command } from 'commander';
import create from './scripts/create.js';
import { getVersion } from './utils/package.js';

const program = new Command();

type Action = {
	alias: string;
	desc: string;
	examples: string[];
	script: any;
};

const actionsMap: Record<string, Action> = {
	'create <projectName>': {
		alias: 'crt',
		desc: 'create react template',
		examples: ['monado create|crt <projectName>'],
		script: create,
	},
};

Object.keys(actionsMap).forEach((action) => {
	program
		.command(action)
		.alias(actionsMap[action].alias)
		.description(actionsMap[action].desc)
		.action((argv: string) => {
			actionsMap[action].script(argv);
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
