const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle-[hash].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /(node_modules|bower_components)/, 
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "true" }],
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-proposal-object-rest-spread",
                            "@babel/plugin-transform-runtime"
                        ]
                    }
                }]
            },{
                test: /\.html$/,
                exclude: /(node_modules|bower_components)/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }],
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",                    
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: (loader) => [
                                require('postcss-import')(),
                                require('postcss-cssnext')(),
                                require('postcss-custom-properties')(),
                                require('cssnano')(),
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    { 
                        loader: "less-loader",
                        options: {
                            paths: [ path.resolve(__dirname, "node_modules") ],
                            modifyVars: {
                                    // 'primary-color': '#5AB57E',
                                    // // 'layout-trigger-background': '#F79663',
                                    // 'layout-trigger-background': '#1DA57A',
                                    // 'layout-header-background': '#002914',
                                    // 'link-color': '#1DA57A',
                                    // 'border-radius-base': '2px',
                                    // or
                                      'hack': `true; @import "${__dirname}/src/assets/less/antd-style-theme.less";`,
                            },
                        javascriptEnabled: true,                    
                    },
                  },
                ],
              },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                  {
                      loader: 'file-loader',
                      options :{
                        context: 'src/assets',
                        name: '[path][name].[ext]'
                      }
                  },
                ],
              }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['*', '.js', 'jsx', '.sass', '.web.js', '.mjs', '.css', '.json', '.web.jsx', '.scss', '.less'],
    },    
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./src/index.html"),
            favicon: './src/assets/images/favicon.png',
        }),
        new CleanWebpackPlugin({verbose: true})  
    ]    
}