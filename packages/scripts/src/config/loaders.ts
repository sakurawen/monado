import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import fs from 'fs';
import { paths } from '../utils/index.js';

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
        ? 'style-loader'
        : MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: cssLoaderOptions,
    },
    {
      loader: 'postcss-loader',
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
        loader: 'resolve-url-loader',
        options: {
          sourceMap: isDevelopment,
          root: paths.appSrc,
        },
      },
      {
        loader: preProcessor,
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};
