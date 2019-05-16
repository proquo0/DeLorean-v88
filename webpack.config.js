const path = require('path');
const webpack = require('webpack');
const renderer = require('marked').Renderer();
const { KotlinDetails } = require('./src/config/delorean.details.js');

const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const isDev = NODE_ENV === 'development';

module.exports = {
    context: __dirname,
    mode: NODE_ENV,
    entry: {
        'DeLorean-v88': ['isomorphic-fetch', './src/index.tsx']
    },
    optimization: {
        minimize: !isDev,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ]
    },
    devtool: isDev ? 'sourcemap' : false,
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].[hash].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader', 'source-map-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader',
                ]
            },
            {
                test: /\.md$/,
                use: [
                    { loader: "html-loader" },
                    {
                        loader: "markdown-loader",
                        options: { pedantic: true, renderer }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                loaders: ['babel-loader',
                    {
                        loader: 'react-svg-loader',
                        query: {
                            jsx: true
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                include: /node_modules/,
                exclude: /src/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/'
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/'
                }
            }
        ]
    },
    plugins: [
        new ManifestPlugin(),
        new MiniCssExtractPlugin({
            filename: isDev ? 'styles/[name].css' : 'styles/[name].[hash].css',
            chunkFilename: isDev ? 'styles/[id].css' : 'styles/[id].[hash].css',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV),
                KOTLIN_EVERYWHERE_API_KEY: JSON.stringify(process.env.KOTLIN_EVERYWHERE_API_KEY),
                DELOREAN_MAP_API: JSON.stringify(process.env.DELOREAN_MAP_API),
                EB_EVENT_ID: JSON.stringify(process.env.EB_EVENT_ID),
            }
        }),
        new webpack.EnvironmentPlugin([
            'NODE_ENV'
        ]),
        new HtmlWebpackPlugin({
            eventName: `${KotlinDetails.name} ${KotlinDetails.location}`,
            description: KotlinDetails.description,
            url: KotlinDetails.url,
            filename: 'index.html',
            environment: NODE_ENV,
            template: path.join(__dirname, './template.ejs'),
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};

