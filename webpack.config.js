const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports={
	experiments: {
		asyncWebAssembly: true,
	},
	entry: './src/index.ts',
	devServer: {
		static: ['dist'],
		host: '0.0.0.0',
		proxy: {
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpe?g|gif|svg|pdf|mp3)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]',
						esModule: false,
					}
				}]
			},
			{
				test: /\.wasm$/,
				type: 'webassembly/async'
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js'],
		extensionAlias: {
			'.js': ['.js', '.ts']
		},
		fallback: { 
			"buffer": false,
			"stream": false,
		},
	},
	performance: {
		hints: false
	},
	output: {
		filename: 'index.js',
		path: path.resolve('dist'),
		clean: true
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		new HtmlWebpackPlugin({
			name: "Webpack Bundling Demo"
		})
	]
};