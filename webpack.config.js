const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/main.js',
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'GE2019 Data Collector',
			template: 'src/index.html',
		}),
		new CopyWebpackPlugin([
			'data/**/constituencies.json',
		]),
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin(),
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
			},
			{
				test: /\.s*[ac]ss$/i,
				use: [
					'vue-style-loader',  // Creates `style` nodes from JS strings
					'css-loader',    // Translates CSS into CommonJS
					'sass-loader',   // Compiles Sass to CSS
				],
			},
		],
	},
	devServer: {
		contentBase: './dist',
		overlay: true,
		hot: true,
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
};
