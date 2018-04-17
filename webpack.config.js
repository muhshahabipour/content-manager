const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

var outputFile = 'contentManager.js';

let pathsToClean = ['dist']

let cleanOptions = {}



module.exports = env => {


    // Use env.<YOUR VARIABLE> here:
    console.log('NODE_ENV: ', env.NODE_ENV) // 'local'
    console.log('Production: ', env.production) // true

    let isProduction = env.production;

    return {
        entry: ['./src/js/index.js'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: outputFile,
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: {
            rules: [{
                    test: /\.js?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ["es2015", "stage-0"]
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [{
                            loader: 'css-loader',
                            options: {
                                url: true,
                                minimize: true,
                                sourceMap: true
                            }
                        }, {
                            loader: 'sass-loader',
                            options: {
                                url: false,
                                sourceMap: true
                            }
                        }]
                    })
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        useRelativePath: true
                    }
                },
                {
                    test: /\.handlebars$/,
                    exclude: /(node_modules|bower_components\/)/,
                    use: [{
                        loader: 'handlebars-loader',
                    }]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(isProduction ? pathsToClean : [], cleanOptions),
            new ExtractTextPlugin({
                filename: "contentManager.css?[hash]-[chunkhash]-[contenthash]-[name]",
                disable: false,
                allChunks: true
            }),
            new webpack.LoaderOptionsPlugin({
                options: {
                    handlebarsLoader: {}
                }
            }),
            new UglifyJsPlugin({
                sourceMap: true
            })
        ],
        // ADD
        devServer: {
            contentBase: './',
            port: 3000,
        },
        node: {
            fs: 'empty'
        },
        resolve: {
            alias: {
                handlebars: 'handlebars/dist/handlebars.min.js',
                'medium-editor': 'medium-editor/dist/js/medium-editor.min.js',
                $: 'jquery/dist/jquery.slim.min.js',
                bootstrap: 'bootstrap/dist/bootstrap.min.js'
            }
        }
    }
};