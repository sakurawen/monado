import { Configuration } from 'webpack';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import type { TransformOptions as EsbuildOptions } from 'esbuild';

const webpackProdConfiguration: Configuration = {
	mode: 'production',
	devtool: false,
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin<EsbuildOptions>({
				minify: TerserPlugin.esbuildMinify,
				terserOptions: {
					minify: true,
					minifyWhitespace: true,
					minifyIdentifiers: true,
					minifySyntax: true,
				},
			}),
			new CssMinimizerPlugin(),
		],
	},
	plugins: [],
};

export default webpackProdConfiguration;
