import { Configuration as DevDevConfiguration } from 'webpack-dev-server';

export type MonadoConfiguration = {
	publicPath?: string;
	devServer?: {
		port?: number;
		proxy: DevDevConfiguration['proxy'];
	};
	alias: {
		[key: string]: string;
	};
	featrue?: {
		mdx?: boolean;
		cssModule: Boolean;
		scss?: boolean;
	};
	plugins?: {
		bundleAnalyzer?: boolean;
	};
};
