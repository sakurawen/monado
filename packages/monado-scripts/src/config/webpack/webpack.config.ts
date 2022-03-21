import { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import paths from '../paths';

const webpackCommonConfig = (): Configuration => {
	const isDevelopment = process.env.NODE_ENV === 'development';

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
						plugins: [require.resolve('postcss-preset-env')],
					},
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

	return {
		entry: paths.appEntry,
		target: 'web',
		output: {
			clean: true,
			filename: 'static/js/[name]-[contenthash:6].js',
			path: paths.appOutput,
		},
		resolve: {
			extensions: ['.ts', '.js', '.tsx', '.tsx', '.json'],
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
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'static/css/[name]-[contenthash:6].css',
			}),
			new HTMLWebpackPlugin({
				template: paths.appHTMLTemplate,
			}),
		],
		cache: {
			type: 'filesystem',
		},
		optimization: {
			sideEffects: true,
			splitChunks: {
				chunks: 'all',
			},
			usedExports: true,
		},
	};
};

export default webpackCommonConfig;
