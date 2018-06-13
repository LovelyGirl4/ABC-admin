var config = process.env.NODE_ENV === 'production' ? require('./webpack/webpack-pro.config.js') : require('./webpack/webpack-dev.config.js');

module.exports = config;
