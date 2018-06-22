var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var pkg = require('../package.json');

var plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './templates/index.dev.html',
        chunks: ['vendor', 'app'],
        title: '农行活动管理后台',
        favicon: './src/assets/favicon.ico',
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.DEPLOY_ENV': JSON.stringify(process.env.DEPLOY_ENV || '')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
];

module.exports = {
    entry: {
        app: path.join(__dirname, '..', 'src/index.js'),
        vendor: pkg.vendor
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        hot: true,
        contentBase: path.join(__dirname, '..', 'src'),
        publicPath: '/',
        historyApiFallback: {
            rewrites: [
                { from: /^\//, to: '/index.html'}
            ]
        },
        host: '0.0.0.0',
        port: process.env.PORT || 3000
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.jsx?$/,
            enforce: 'pre',
            exclude: /node_modules/,
            loader: 'eslint-loader'
        }, {
            test: /\.css$/,
            include: path.join(__dirname, '..', 'node_modules'),
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.css$/,
            include: path.join(__dirname, '..', 'src/index.css'),
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.css$/,
            include: path.join(__dirname, '..', 'src'),
            exclude: path.join(__dirname, '..', 'src/index.css'),
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [autoprefixer]
                }
            }]
        }, {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf|xlsx)\??.*$/,
            use: 'url-loader?' + JSON.stringify({ name: '[hash].[ext]', limit: '8096' })
        }]
    },
    plugins
};
