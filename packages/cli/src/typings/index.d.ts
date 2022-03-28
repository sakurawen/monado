declare module 'download-git-repo' {
	function download(url: string, type: string, callback: (err: Error) => void);
	function download(
		url: string,
		type: string,
		options: {
			clone?: boolean;
			headers?: {
				[key: string]: any;
			};
		},
		callback: (err: Error) => void
	);
	export default download;
}
