import type { JsMinifyOptions as SwcOptions } from '@swc/core';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import fs from 'fs-extra';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration, RuleSetRule } from 'webpack';
import { MonadoConfiguration } from '../types';
import { alias, files, paths, __ } from '../utils/index.js';
import { getStyleloaders } from './style.js';
import { getPlugins } from './plugins.js';

const webpackConfig = (monadoConf?: MonadoConfiguration): Configuration => {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const isProduction = process.env.NODE_ENV === 'production';

	const projPackageJSON = files.loadPackageJson();

	const useMDX = !!(
		projPackageJSON?.dependencies['@mdx-js/react'] ||
		projPackageJSON?.devDependencies['@mdx-js/react']
	);

	const useScss = !!(
		projPackageJSON?.dependencies['sass'] ||
		projPackageJSON?.devDependencies['sass']
	);

	const useTypescript = fs.existsSync(paths.AppTSConfig);
	const useAnalyzer = monadoConf?.plugins?.bundleAnalyzer === true;
	const enableSourceMap = monadoConf?.sourceMap || false;
	const customAlias = alias.getCustomAlias(monadoConf?.alias);

	return {
		entry: paths.appEntry,
		output: {
			clean: true,
			filename: 'static/js/[name]-[contenthash:6].js',
			path: paths.appOutput,
			publicPath: monadoConf?.publicPath ? monadoConf?.publicPath : '/',
		},

		target: 'web',
		mode: isDevelopment ? 'development' : 'production',
		devtool: isDevelopment
			? 'cheap-module-source-map'
			: enableSourceMap
			? 'cheap-module-source-map'
			: false,
		stats: 'errors-only',
		performance: false,
		resolve: {
			symlinks: true,
			alias: customAlias,
			modules: ['node_modules', paths.appNodeModules],
			extensions: [
				'.js',
				'.jsx',
				useTypescript && '.ts',
				useTypescript && '.tsx',
				'.json',
			].filter(Boolean) as string[],
		},
		module: {
			rules: [
				{
					test: /\.(png|jpe?g|gif|ico|webp)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'static/image/[name]-[contenthash:6][ext]',
					},
				},
				{
					test: /\.(m4a|mp3|acc|mp4|mov|ogg|webm)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'static/media/[name]-[contenthash:6][ext]',
					},
				},
				{
					test: /\.svg$/i,
					use: [
						{
							loader: '@svgr/webpack',
							options: {
								prettier: false,
								svgo: false,
								svgoConfig: {
									plugins: [{ removeViewBox: false }],
								},
								titleProp: true,
								ref: true,
							},
						},
						{
							loader: 'file-loader',
							options: {
								name: 'static/image/[name]-[contenthash:6].[ext]',
							},
						},
					],
					issuer: {
						and: [/\.(ts?x|js?x|md|mdx)$/],
					},
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'static/font/[name]-[contenthash:6][ext]',
					},
				},
				{
					test: /\.css$/i,
					exclude: /\.module\.css$/,
					use: getStyleloaders({
						modules: {
							mode: 'icss',
						},
						sourceMap: isDevelopment,
						importLoaders: 1,
						esModule: true,
					}),
				},
				{
					test: /\.module\.css$/,
					use: getStyleloaders({
						modules: {
							auto: true,
							mode: 'local',
							localIdentName: '[local]-[hash:base64:6]',
						},
						sourceMap: isDevelopment,
						importLoaders: 1,
						esModule: true,
					}),
				},
				useScss && {
					test: /\.(sass|scss)$/i,
					exclude: /\.module\.(sass|scss)$/,
					use: getStyleloaders(
						{
							modules: {
								mode: 'icss',
							},
							sourceMap: isDevelopment,
							importLoaders: 3,
						},
						'sass-loader'
					),
				},
				useScss && {
					test: /\.module\.(sass|scss)$/i,
					use: getStyleloaders(
						{
							modules: {
								auto: true,
								mode: 'local',
								localIdentName: '[local]-[hash:base64:6]',
							},
							sourceMap: isDevelopment,
							importLoaders: 3,
						},
						'sass-loader'
					),
				},
				{
					test: /\.(js|jsx|ts|tsx)$/i,
					include: paths.appSrc,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'swc-loader',
						options: {
							env: {
								coreJs: 3,
								mode: 'usage',
							},
							jsc: {
								externalHelpers: isProduction,
								target: 'es5',
								transform: {
									react: {
										runtime: 'automatic',
										development: isDevelopment,
										refresh: isDevelopment,
									},
								},
								parser: {
									syntax: useTypescript ? 'typescript' : 'ecmascript',
									tsx: true,
									dynamicImport: true,
								},
							},
						},
					},
				},
				useMDX && {
					test: /\.mdx?$/,
					use: [
						{
							loader: '@mdx-js/loader',
							/** @type {import('@mdx-js/loader').Options} */
							options: {},
						},
					],
				},
			].filter(Boolean) as RuleSetRule[],
		},
		plugins: getPlugins({
			useAnalyzer,
			useTypescript,
		}),
		cache: isDevelopment
			? {
					type: 'filesystem',
					store: 'pack',
					cacheDirectory: paths.appWebpackCache,
					buildDependencies: {
						config: [__.filename()],
						tsconfig: [paths.AppTSConfig].filter((f) => fs.existsSync(f)),
					},
			  }
			: false,
		optimization: {
			minimize: isProduction,
			minimizer: isProduction
				? [
						new TerserPlugin<SwcOptions>({
							minify: TerserPlugin.swcMinify,
							terserOptions: {
								compress: {
									unused: true,
								},
								mangle: true,
							},
						}),
						new CssMinimizerPlugin(),
				  ]
				: [],
			sideEffects: true,
			splitChunks: {
				chunks: 'all',
				minSize: 1000 * 30,
				minChunks: 1,
				maxAsyncRequests: 6,
				maxInitialRequests: 3,
			},
			usedExports: true,
		},
		infrastructureLogging: {
			level: 'error',
		},
	};
};

export default webpackConfig;
