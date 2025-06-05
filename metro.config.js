// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require('nativewind/metro');
 
// const config = getDefaultConfig(__dirname)
 
// module.exports = withNativeWind(config, { input: './global.css' })


const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');


const config = getDefaultConfig(__dirname);

// Optional: lightningcss transformer config
config.transformer = {
  ...config.transformer,
  experimentalImportSupport: false,
  unstable_disableES6Transforms: false,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = withNativeWind(config, { input: './global.css' });

