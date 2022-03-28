import { execSync } from 'child_process';

const isInstall = () => {
	let install = true;
	try {
		execSync('git --version', { stdio: 'ignore' });
	} catch {
		install = false;
	}
	return install;
};

const init = () => {
	let isSuccess = true;
	try {
		execSync('git init', { stdio: 'ignore' });
	} catch {
		isSuccess = false;
	}
	return isSuccess;
};

const firstCommit = () => {
	let isSuccess = true;
	try {
		execSync('git add -A', { stdio: 'ignore' });
		execSync("git commit -m '项目初始化'", { stdio: 'ignore' });
	} catch(e) {
    console.error(e);
		isSuccess = false;
	}
	return isSuccess;
};

export default {
	isInstall,
	init,
	firstCommit,
};
