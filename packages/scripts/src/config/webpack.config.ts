import { Configuration, RuleSetRule, WebpackPluginInstance } from 'webpack';
import type { JsMinifyOptions as SwcOptions } from '@swc/core';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import Webpackbar from 'webpackbar';
import fs from 'fs-extra';
import paths from '../utils/paths';
import resolve from 'resolve';
import { MonadoConfiguration } from '../types';
import path from 'path';
import { loadProjectPackageJson } from '../utils/files';

const webpackConfig = (monadoConf?: MonadoConfiguration): Configuration => {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const isProduction = process.env.NODE_ENV === 'production';
	const useTailwindcss = fs.existsSync(paths.AppTailwindcssConfig);
	const useTypescript = fs.existsSync(paths.AppTSConfig);
	const usePostcssConfig = fs.existsSync(paths.appPostCssConfig);
	const projPackageJSON = loadProjectPackageJson();

	const useMDX = !!(
		projPackageJSON?.dependencies['@mdx-js/react'] ||
		projPackageJSON?.devDependencies['@mdx-js/react']
	);

	const useScss = !!(
		projPackageJSON?.dependencies['sass'] ||
		projPackageJSON?.devDependencies['sass']
	);

	const enableAlias = Object.keys(monadoConf?.alias || []).length !== 0;

	const customAlias = enableAlias
		? Object.entries(monadoConf?.alias || []).reduce(
				(acc, [key, val]: [string, string]) => {
					acc[key] = path.resolve(process.cwd(), val);
					return acc;
				},
				{} as Record<string, string>
		  )
		: {};

	const enbaleBundleAnalyzer = monadoConf?.plugins?.bundleAnalyzer === true;

	const getStyleloaders = (
		cssLoaderOptions: string | { [key: string]: any },
		preProcessor?: string
	) => {
		const loaders = [
			{
				loader: isDevelopment
					? require.resolve('style-loader')
					: MiniCssExtractPlugin.loader,
			},
			{
				loader: require.resolve('css-loader'),
				options: cssLoaderOptions,
			},
			{
				loader: require.resolve('postcss-loader'),
				options: {
					postcssOptions: {
						config: usePostcssConfig ? paths.appPostCssConfig : false,
						plugins: [
							useTailwindcss && 'tailwindcss',
							'postcss-flexbugs-fixes',
							'postcss-preset-env',
							useTailwindcss && 'postcss-normalize',
						].filter(Boolean),
					},
					sourceMap: isDevelopment,
				},
			},
		];
		if (preProcessor) {
			loaders.push(
				{
					loader: require.resolve('resolve-url-loader'),
					options: {
						sourceMap: isDevelopment,
						root: paths.appSrc,
					},
				},
				{
					loader: require.resolve(preProcessor),
					options: {
						sourceMap: true,
					},
				}
			);
		}
		return loaders;
	};

	const getPlugins = () => {
		const plugins: WebpackPluginInstance[] = [
			new HTMLWebpackPlugin({
				template: paths.appHTMLTemplate,
			}),
		];
		if (useTypescript) {
			plugins.push(
				new ForkTsCheckerWebpackPlugin({
					async: isDevelopment,
					typescript: {
						context: paths.app,
						typescriptPath: resolve.sync('typescript', {
							basedir: paths.appNodeModules,
						}),
						memoryLimit: 4396,
						configFile: paths.AppTSConfig,
						configOverwrite: {
							compilerOptions: {
								noEmit: true,
							},
						},
						diagnosticOptions: {
							semantic: true,
							syntactic: true,
						},
						mode: 'write-references',
					},
					logger: undefined,
					issue: {
						include: [{ file: '**/src/**/*.{ts,tsx}' }],
						exclude: [],
					},
				})
			);
		}
		if (isDevelopment) {
			plugins.push(
				new ReactRefreshPlugin({
					overlay: false,
				})
			);
		}
		if (isProduction) {
			plugins.push(
				...([
					new Webpackbar({
						name: 'Monado Scripts',
						color: '#10b981',
					}),
					new MiniCssExtractPlugin({
						filename: 'static/css/[name]-[contenthash:6].css',
						chunkFilename: 'static/css/[name]-[contenthash:6].chunks.css',
					}),
					enbaleBundleAnalyzer && new BundleAnalyzerPlugin(),
					new CopyWebpackPlugin({
						patterns: [
							{
								from: paths.appPublicDirectory,
								to: paths.appOutput,
								globOptions: {
									ignore: ['**/index.html'],
								},
							},
						],
					}),
				].filter(Boolean) as WebpackPluginInstance[])
			);
		}
		return plugins;
	};
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
		devtool: isDevelopment && 'cheap-module-source-map',
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
							loader: require.resolve('@svgr/webpack'),
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
							loader: require.resolve('file-loader'),
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
						loader: require.resolve('swc-loader'),
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
							loader: require.resolve('@mdx-js/loader'),
							/** @type {import('@mdx-js/loader').Options} */
							options: {},
						},
					],
				},
			].filter(Boolean) as RuleSetRule[],
		},
		plugins: getPlugins(),
		cache: isDevelopment
			? {
					type: 'filesystem',
					store: 'pack',
					cacheDirectory: paths.appWebpackCache,
					buildDependencies: {
						config: [__filename],
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
			level: 'none',
		},
	};
};

export default webpackConfig;
