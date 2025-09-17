module.exports = {
  presets: ['module:@react-native/babel-preset'],
   env: {
    production: {
      plugins: ['transform-remove-console'], // removes all console.* in release
    },
  },
};
