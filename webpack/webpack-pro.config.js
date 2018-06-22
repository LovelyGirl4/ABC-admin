var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var pkg = require('../package.json');
var publicPath = 'assets';

var plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './templates/index.html',
        chunks: ['vendor', 'app', 'manifest'],
        inject: false,
        title: '农行活动管理后台',
        favicon: './src/assets/favicon.ico',
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor', 'manifest'],
        filename: publicPath + '/js/[name].[chunkhash].js'
    }),
    new webpack.HashedModuleIdsPlugin({
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 20
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.DEPLOY_ENV': JSON.stringify(process.env.DEPLOY_ENV || '')
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
        }
    }),
    new ExtractTextPlugin(publicPath + '/style/style.[hash].css')
];

module.exports = {
    entry: {
        app: path.join(__dirname, '..', 'src/index.js'),
        vendor: pkg.vendor
    },
    output: {
        path: path.join(__dirname, '..', 'dist'),
        filename: publicPath + '/js/[name].[chunkhash].js',
        publicPath: '/'
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
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        }, {
            test: /\.css$/,
            include: path.join(__dirname, '..', 'src/index.css'),
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        }, {
            test: /\.css$/,
            include: path.join(__dirname, '..', 'src'),
            exclude: path.join(__dirname, '..', 'src/index.css'),
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer]
                    }
                }]
            })
        }, {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf|xlsx)\??.*$/,
            use: 'url-loader?' + JSON.stringify({ name: '[hash].[ext]', limit: '8096' })
        }]
    },
    plugins,
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
