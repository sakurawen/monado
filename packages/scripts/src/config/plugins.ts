import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import resolve from 'resolve';
import { WebpackPluginInstance } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import type { MonadoConfiguration } from '../types.js';
import { paths } from '../utils/index.js';

type pluginOptions = {
	monadoConf?: MonadoConfiguration;
	useAnalyzer: boolean;
	useTypescript: boolean;
	homepage?: string;
};

export const getPlugins = ({ useTypescript, useAnalyzer }: pluginOptions) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const plugins: WebpackPluginInstance[] = [
    new HtmlWebpackPlugin({
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
              skipLibCheck: true,
              sourceMap: isDevelopment,
              noEmit: true,
              incremental: true,
              tsBuildInfoFile: paths.AppTSCachePath,
            },
          },
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
        },
        logger: 'webpack-infrastructure',
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
        new MiniCssExtractPlugin({
          filename: 'static/css/[name]-[contenthash:6].css',
          chunkFilename: 'static/css/[name]-[contenthash:6].chunks.css',
        }),
        useAnalyzer && new BundleAnalyzerPlugin(),
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
