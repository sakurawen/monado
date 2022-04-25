import { Configuration, RuleSetRule, WebpackPluginInstance } from 'webpack';
import type { TransformOptions as EsbuildOptions } from 'esbuild';
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
import { MonadoConfiguration } from 'index';

const webpackConfig = (monadoConf?: MonadoConfiguration): Configuration => {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const isProduction = process.env.NODE_ENV === 'production';
	const useTailwindcss = fs.existsSync(paths.AppTailwindcssConfig);
	const useTypescript = fs.existsSync(paths.AppTSConfig);

	const enableCssModule = monadoConf?.featrue?.cssModule === true;
	const enableScss = monadoConf?.featrue?.scss === true;
	const enableMdx = monadoConf?.featrue?.mdx === true;

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
				inject: true,
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
						name: 'monado',
						color: '#a3e635',
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
		},
		target: 'web',
		mode: isDevelopment ? 'development' : 'production',
		devtool: isDevelopment && 'cheap-module-source-map',
    stats:"errors-only",
		performance: false,
		resolve: {
			modules: ['node_modules', paths.appNodeModules],
			alias: {
				'@': paths.appSrc,
			},
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
					test: /\.(png|jpe?g|gif|ico)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'static/image/[name]-[contenthash:6][ext]',
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
					test: /\.(woff|woff2|ttf|eot)$/i,
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
				enableCssModule && {
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
				enableScss && {
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
				enableScss && {
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
					exclude: /node_modules/,
					use: {
						loader: require.resolve('babel-loader'),
						options: {
							presets: [
								[
									require.resolve('@babel/preset-env'),
									{
										corejs: 3,
										useBuiltIns: 'usage',
									},
								],
								[
									require.resolve('@babel/preset-react'),
									{
										runtime: 'automatic',
									},
								],
								useTypescript && require.resolve('@babel/preset-typescript'),
							].filter(Boolean),
							plugins: [
								isDevelopment && require.resolve('react-refresh/babel'),
							].filter(Boolean),
							cacheDirectory: true,
							compact: !isDevelopment,
							cacheCompression: false,
						},
					},
				},
				enableMdx && {
					test: /\.mdx?$/,
					use: [
						{
							loader: require.resolve('babel-loader'),
							options: {
								presets: [
									require.resolve('@babel/preset-env'),
									[
										require.resolve('@babel/preset-react'),
										{
											runtime: 'automatic',
										},
									],
									useTypescript && require.resolve('@babel/preset-typescript'),
								].filter(Boolean),
								cacheDirectory: true,
								compact: !isDevelopment,
								cacheCompression: false,
							},
						},
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
						defaultWebpack: ['webpack/lib/'],
						config: [__filename],
						tsconfig: [paths.AppTSConfig].filter((f) => fs.existsSync(f)),
					},
			  }
			: false,
		optimization: {
			minimize: isProduction,
			minimizer: isProduction
				? [
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
	};
};

export default webpackConfig;
