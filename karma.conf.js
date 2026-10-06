module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['src/utils/validators.js', 'test/**/*.spec.js'],
    preprocessors: {
      'src/utils/validators.js': ['webpack', 'coverage'],
      'test/**/*.spec.js': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' }
        }]
      }
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage/karma',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: 2
  });
};
