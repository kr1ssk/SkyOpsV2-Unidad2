module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['test/**/*.spec.js'],
    preprocessors: { 'test/**/*.spec.js': ['webpack', 'coverage'] },
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
