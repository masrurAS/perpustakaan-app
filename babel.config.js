module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          "@config": "./src/config",
          "@support": "./src/support",
          "@images": "./src/assets/img",
          "@store": "./src/store",
          "@http": "./src/http",
          "@actions": "./src/actions",
          "@components": "./src/components",
          "@screens": "./src/screens",
          "@theme": "./src/theme",
        }
      }
    ]
  ]
};
