import { Configuration } from 'webpack';
import { path } from '../utils';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';

const WebpackCommonConfig: Configuration = {
	mode: 'development',
	entry: path.AppResolve('src/index.tsx'),
	devtool: 'cheap-module-source-map',
	target: 'web',
	output: {
		clean: true,
		filename: 'bundle-[contenthash:8].js',
		path: path.AppResolve('dist'),
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
				include: path.AppResolve('src'),
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
		new HTMLWebpackPlugin({
			template: path.AppResolve('public/index.html'),
		}),
	],
};

export default WebpackCommonConfig;
