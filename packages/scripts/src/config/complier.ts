import Webpack from 'webpack';
import {
  webpackBuildConfiguration,
  webpackDevConfiguration
} from '../config/index.js';
import { files } from '../utils/index.js';

export const getBuildCompiler = () => {
	const monadoConfiguration = files.getMonadoConfiguration();
	const conf = webpackBuildConfiguration(monadoConfiguration);
	const compiler = Webpack(conf);
	return compiler;
};

export const getDevServer = async () => {
	const monadoConfiguration = files.getMonadoConfiguration();
	const devServer = await webpackDevConfiguration(monadoConfiguration);
	return devServer;
};
