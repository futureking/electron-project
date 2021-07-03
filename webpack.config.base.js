const path = require('path');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    output: {
        path: path.resolve(__dirname, './dist/main'),
        filename: '[name].js',
    },
    devtool: isDevelopment ? 'source-map' : false,
    node: {
        __dirname: false,
        __filename: false,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    module: {
        rules: [{
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: [/node_modules/],
            },
            {
                test: /\.node$/,
                loader: "node-loader",
            },
            // {
            //     test: /\.(png|jpe?g|gif)$/,
            //     loader: 'url-loader',
            //     options: {
            //         name: '[path][name].[ext]?[hash]'
            //     },
            //     // exclude: /library\/.*\/assets$/
            // },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.FLUENTFFMPEG_COV': false,
        }),
    ],
};