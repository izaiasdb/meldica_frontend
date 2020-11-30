const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        stats: { colors: true },
        hot: true,
        inline: true,
        open: true,
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'dist'),
        port: 8089,
		host: '0.0.0.0'
        //host: '0.0.0.0'//Acessa por IP na rede local
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') })      
    ]
})