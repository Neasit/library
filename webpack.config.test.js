const nodeExternals = require('webpack-node-externals');
const path = require('path');

const ProvidePlugin = require('webpack').ProvidePlugin;

module.exports = (env, argv) => {

  const isDebug = env == 'dbg';
  const loaders = [];

  if (!isDebug) {
    loaders.push('istanbul-instrumenter-loader');
  }

  loaders.push('ts-loader');

  return {
    mode: 'development',
    entry: './src/index.ts',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [{
        test: /\.ts$/,
        exclude: /node_modules/,
        include: path.resolve('src'), // instrument only testing sources with Istanbul, after ts-loader runs
        use: loaders
      },
      {
        test: /\.js?$/,
        include: path.resolve('src'), // instrument only testing sources with Istanbul, after ts-loader runs
        exclude: /node_modules/,
      }],
    },
    plugins: [
      new ProvidePlugin({
        'TextDecoder': ['text-encoding', 'TextDecoder'],
        'TextEncoder': ['text-encoding', 'TextEncoder'],
      })
    ],
    target: 'node',  // webpack should compile node compatible code
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    devtool: 'inline-cheap-module-source-map'
  };
};
