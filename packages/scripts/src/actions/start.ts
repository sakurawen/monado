import chalk from 'chalk';
import WebpackDevServer from 'webpack-dev-server';
import { log, theme } from '../utils/index.js';
import { getDevServer } from '../config/complier.js';
/**
 * 启动开发服务器
 */
const start = async () => {
  process.env.NODE_ENV = 'development';
  const devServer = await getDevServer();

  devServer.startCallback((err) => {
    if (err) {
      console.log(chalk.hex(theme.error)(err));
      devServer.close();
      process.exit();
    }
    log.clear();
    const url = chalk
      .hex('#10b981')
      .bold(`http://localhost:${devServer.options.port}`);
    const host = chalk
      .hex('#10b981')
      .bold(
        `http://${WebpackDevServer.internalIPSync('v4')}:${
          devServer.options.port
        }`
      );
    console.log('');
    log.success(
      'start',
      `started server\n\n You can now open a browser to view the project \n\n Local:           ${url}\n On Your Network: ${host}\n`
    );
  });
};

export default start;
