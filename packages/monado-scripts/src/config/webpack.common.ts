import { Configuration } from 'webpack';
import { paths } from '../utils';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import Webpackbar from 'webpackbar';

const WebpackCommonConfig: Configuration = {
	mode: 'development',
	entry: paths.appEntry,
	devtool: 'cheap-module-source-map',
	target: 'web',
	output: {
		clean: true,
		filename: 'bundle-[contenthash:8].js',
		path: paths.appOutput,
	},
	resolve: {
		extensions: ['.ts', '.js', '.tsx', '.tsx'],
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{ loader: require.resolve('css-loader') },
				],
			},
			{
				test: /\.(jsx?|tsx?)$/,
				include: paths.appSrc,
				use: {
					loader: require.resolve('babel-loader'),
					options: {
						presets: [
							require.resolve('@babel/preset-env'),
							require.resolve('@babel/preset-react'),
							require.resolve('@babel/preset-typescript'),
						],
					},
				},
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new Webpackbar(),
		new HTMLWebpackPlugin({
			template: paths.appHTMLTemplate,
		}),
	],
};

export default WebpackCommonConfig;
