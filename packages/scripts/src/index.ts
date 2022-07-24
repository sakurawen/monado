import cac from 'cac';
import build from './actions/build.js';
import start from './actions/start.js';
import { pkg } from './utils/index.js';

const cli = cac('monado-scripts');

cli.version(pkg.getVersion());

cli.command('build', '构建应用').action(() => {
	build();
});

cli.command('start', '启动开发服务器').action(() => {
	start();
});

cli.help();

cli.parse();
