const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: "production",
    devtool: 'source-map',
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') })
    ]    
})