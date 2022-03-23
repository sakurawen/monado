import { Configuration, WebpackPluginInstance } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import Webpackbar from 'webpackbar';
import fs from 'fs-extra';
import paths from '../paths';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import type { TransformOptions as EsbuildOptions } from 'esbuild';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import { resolveMomadoConfig } from '../../utils/file';

const webpackConfig = (): Configuration => {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const isProduction = process.env.NODE_ENV === 'production';
	const useTailwindcss = fs.existsSync(paths.AppTailwindcssConfig);
	const useTypescript = fs.existsSync(paths.AppTSConfig);
	resolveMomadoConfig();

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
							useTailwindcss && 'postcss-normalize',
							'postcss-flexbugs-fixes',
							'postcss-preset-env',
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
					typescript: {
						diagnosticOptions: {
							semantic: true,
							syntactic: true,
						},
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
				new Webpackbar(),
				new MiniCssExtractPlugin({
					filename: 'static/css/[name]-[contenthash:6].css',
				})
			);
		}
		return plugins;
	};

	return {
		entry: paths.appEntry,
		mode: isDevelopment ? 'development' : 'production',
		devtool: isDevelopment ? false : 'cheap-module-source-map',
		target: 'web',
		output: {
			clean: true,
			filename: 'static/js/[name]-[contenthash:6].js',
			path: paths.appOutput,
		},
		resolve: {
			alias: {
				'@': paths.appSrc,
			},
			extensions: ['.ts', '.js', '.jsx', '.tsx', '.tsx', '.json'],
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
				{
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
				{
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
					test: /\.(jsx?|tsx?)$/i,
					include: paths.appSrc,
					use: {
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
								require.resolve('@babel/preset-typescript'),
							],
							plugins: [
								isDevelopment && require.resolve('react-refresh/babel'),
							].filter(Boolean),
						},
					},
				},
			],
		},
		plugins: getPlugins(),
		cache: isDevelopment
			? false
			: {
					type: 'filesystem',
			  },
		optimization: {
			minimize: !isDevelopment,
			minimizer: isDevelopment
				? []
				: [
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
			sideEffects: true,
			splitChunks: {
				chunks: 'all',
			},
			usedExports: true,
		},
	};
};

export default webpackConfig;
