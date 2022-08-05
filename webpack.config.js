// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        client: {
            overlay: true,
            logging: 'error',
        },
        open: true,
        hot: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/app.html',
        }),

        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
