const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.base');

module.exports = webpackMerge.smart(webpackBaseConfig, {
    target: 'electron-main',
    entry: {
        preload: './src/main/preload.ts',
        main: './src/main/main.ts',

    },
    // externals: {
    //     'express': 'express',
    //     'fluent-ffmpeg': 'fluent-ffmpeg',
    //     '@ffmpeg-installer/ffmpeg': '@ffmpeg-installer/ffmpeg',
    //     'ffmpeg-static': 'ffmpeg-static',
    //     'ffprobe-static': 'ffprobe-static',
    //     'audio-play': 'audio-play',
    //     'audio-loader': 'audio-loader',
    // },
});