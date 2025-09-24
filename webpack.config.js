const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'rn-toolkit',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              module: 'esnext'
            }
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    'react': 'react',
    'react-native': 'react-native',
    'react-native-navigation': 'react-native-navigation',
    'react-native-reanimated': 'react-native-reanimated',
    'react-native-mmkv': 'react-native-mmkv',
    'realm': 'realm',
    '@react-native-clipboard/clipboard': '@react-native-clipboard/clipboard',
    'react-native-device-info': 'react-native-device-info',
  },
};