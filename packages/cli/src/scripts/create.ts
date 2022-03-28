import { fs } from 'zx';
import path from 'path';
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
	console.log(`create project name:${projectName}`);
	spinner.start('项目创建中');
	const hasProjectDir = fs.existsSync(path.join(process.cwd(), projectName));
	if (hasProjectDir) {
		spinner.fail(
			chalk.bold.red(
				`当前目录下,'${projectName}'已存在,请修改项目名,或者删除该目录下的'${projectName}'`
			)
		);
		return;
	}

	const projectDir = path.resolve(process.cwd(), projectName);

	try {
		await downloadTemplate(projectDir);
		spinner.info('模板创建成功');
	} catch {
		spinner.fail('下载模板失败，请检查网络');
	}

	const gitInstall = git.isInstall();
	if (gitInstall) {
		process.chdir(projectDir);
		git.init();
		git.firstCommit();
		console.log('初始化git仓库 ');
	}
	process.chdir(path.resolve(projectDir, '..'));
	console.log(chalk.green('项目创建成功'));
}

export default create;
