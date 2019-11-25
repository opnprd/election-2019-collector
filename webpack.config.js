const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	mode: 'development',
	entry: './src/main.js',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/
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
	plugins: [
		new CopyWebpackPlugin([
			'index.html',
			'data/**/constituencies.json',
		]),
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin(),
	],
};
