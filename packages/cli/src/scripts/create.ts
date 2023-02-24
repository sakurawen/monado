import path from 'path';
import { fs } from 'zx';
import chalk from 'chalk';
import Ora from 'ora';
import { downloadTemplate } from '../utils/download.js';
import git from '../utils/git.js';
import validateName from 'validate-npm-package-name';

/**
 * 创建项目
 * @param projectName
 * @returns
 */
async function create(projectName: string) {
  const { validForNewPackages, errors, warnings } = validateName(projectName);
  if (!validForNewPackages) {
    console.error(`不能使用${chalk.green(projectName)}创建项目,错误如下:\n`);
    [...(errors || []), ...(warnings || [])].forEach((err) => {
      console.error(chalk.red(err));
    });
    process.exit(1);
  }

  const spinner = Ora();
  const hasProjectDir = fs.existsSync(path.join(process.cwd(), projectName));
  if (hasProjectDir) {
    spinner.fail(
      chalk.bold.red(
        `当前目录下,'${projectName}'已存在,请修改项目名,或删除该目录下的'${projectName}'`
      )
    );
    return;
  }
  console.log(`项目开始创建,项目名:${chalk.green(projectName)}`);
  spinner.start('模板下载中...');
  const projectDir = path.resolve(process.cwd(), projectName);

  try {
    await downloadTemplate(projectDir);
    spinner.succeed('模板创建成功');
  } catch {
    spinner.fail('下载模板失败，请检查网络');
    return;
  }
  const gitInstalled = git.checkInstalled();
  if (gitInstalled) {
    process.chdir(projectDir);
    git.init();
    git.firstCommit();
    console.log('初始化git仓库');
  }
  process.chdir(path.resolve(projectDir, '..'));
  console.log(chalk.green('项目创建成功'));
}

export default create;
