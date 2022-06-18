import { Configuration as DevDevConfiguration } from 'webpack-dev-server';

export type MonadoConfiguration = {
	publicPath?: string;
	devServer?: {
		port?: number;
		proxy: DevDevConfiguration['proxy'];
	};
	sourceMap: boolean;
	alias: {
		[key: string]: string;
	};
	plugins?: {
		bundleAnalyzer?: boolean;
	};
};
