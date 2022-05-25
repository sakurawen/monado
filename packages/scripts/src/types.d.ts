import { Configuration as DevDevConfiguration } from 'webpack-dev-server';

export type MonadoConfiguration = {
	publicPath?: string;
	devServer?: {
		port?: number;
		proxy: DevDevConfiguration['proxy'];
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
