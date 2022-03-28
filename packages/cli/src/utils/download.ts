import download from 'download-git-repo';

/**
 * 下载模板
 */
export const downloadTemplate = (dir: string) => {
	return new Promise<void>((resolve, reject) => {
		download('sakurawen/monado-react-ts-template', dir, (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
};
