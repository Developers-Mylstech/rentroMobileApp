const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // Enable CSS support for both platforms
  isCSSEnabled: true,
});

module.exports = withNativeWind(config, {
  input: './global.css',
  // Add this for Android support
  projectRoot: __dirname,
  configPath: './tailwind.config.js',
});