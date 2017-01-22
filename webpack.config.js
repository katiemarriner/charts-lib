var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  // template: __dirname + '/index.html',
  // filename: './index.html',
  // inject: 'body'
});

var ExtractTextPluginConfig = new ExtractTextPlugin('./dist/css/style.css', {
    allChunks: true
});

module.exports = {
    entry: './src/main.js',
    output: {
        path: './src/js',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: "style!css"
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('css!sass')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        ExtractTextPluginConfig
    ]
};