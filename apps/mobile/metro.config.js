const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json']

module.exports = config;