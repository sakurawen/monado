import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import fs from 'fs';
import { paths } from '../utils';

export const getStyleloaders = (
	cssLoaderOptions: string | { [key: string]: any },
	preProcessor?: string
) => {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const useTailwindcss = fs.existsSync(paths.AppTailwindcssConfig);
	const usePostcssConfig = fs.existsSync(paths.appPostCssConfig);
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
