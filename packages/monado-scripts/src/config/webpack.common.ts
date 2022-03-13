import { Configuration } from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const WebpackCommonConfig: Configuration = {
	mode: 'production',
	entry: path.resolve(process.cwd(), 'src/index.ts'),
	output: {
		clean: true,
		filename: 'bundle-[contenthash:8].js',
		path: path.resolve(process.cwd(), 'dist'),
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
				exclude: /node_modules/,
				include: path.resolve(process.cwd(), 'src'),
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
	plugins: [new MiniCssExtractPlugin()],
};

export default WebpackCommonConfig;
