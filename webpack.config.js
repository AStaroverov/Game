const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const {
    getSharedWorkerLoader,
    getWorkerLoader,
    getGLSLLoader,
    getTsLoader,
    getResolve,
} = require('./webpack.utils');

const env = process.env.NODE_ENV;
const DEV_NAME = 'development';
const PROD_NAME = 'production';
const isProd = env === PROD_NAME;

module.exports = {
    devtool: isProd ? undefined : 'eval',
    mode: env || DEV_NAME,
    entry: path.join(__dirname, `/src/index.ts`),
    output: {
        filename: `game.[hash].js`,
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: getResolve(),
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            getGLSLLoader(),
            getTsLoader({ tsx: true }),
            getWorkerLoader(),
            getSharedWorkerLoader(),
        ],
    },
    optimization: {
        minimize: isProd,
        minimizer: [
            new ESBuildMinifyPlugin({
                target: 'es2020', // Syntax to compile to (see options below for possible values)
            }),
        ],
    },
    plugins: [
        new ForkTsCheckerPlugin({
            eslint: {
                files: './src/**/*.{ts,tsx,js}',
            },
        }),
        new webpack.DefinePlugin({
            'process.env.NODE': JSON.stringify(env),
        }),
        new HtmlWebpackPlugin(),
    ],
    experiments: {
        syncWebAssembly: true,
        asyncWebAssembly: true,
    },
};
