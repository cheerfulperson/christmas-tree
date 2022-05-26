const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = {
    entry: path.resolve(__dirname, './src/index.ts'),
    mode: 'development',
    module: {
        rules: [{
                test: /\.css$/i,
                use: [ {
                        loader: MiniCssExtractPlugin.loader,
                    }, 
                    'css-loader',
                ],
            },{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }, {
                test: /\.s[ac]ss$/i,
                use: [ {
                        loader: MiniCssExtractPlugin.loader,
                    }, 
                    'css-loader', 
                    'sass-loader',
                ],
            }, {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    },
                  },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '../dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
              { from: path.resolve(__dirname, './src/assets'), to: "assets" }
            ],
        }),
        new MiniCssExtractPlugin(),
    ],
};

module.exports = ({
    mode
}) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};