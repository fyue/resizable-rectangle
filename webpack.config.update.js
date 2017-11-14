const path = require('path');

module.exports = (config) => {
  config.resolve = {
    ...config.resolve,
    alias: {
      components: path.resolve(process.cwd(), './src') + '/components',
    }
  };
  return config;
};
