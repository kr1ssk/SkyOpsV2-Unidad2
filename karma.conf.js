module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],
    files: [
      { pattern: "test/**/*.spec.js", watched: false },
      { pattern: "public/assets/img/*.svg", included: false, served: true },
    ],
    proxies: { "/assets/img/": "/base/public/assets/img/" },
    preprocessors: { "test/**/*.spec.js": ["webpack"] },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "120" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                // Instrumentar fuentes antes de empaquetar: cobertura real de componentes y servicios.
                plugins: [
                  [
                    "istanbul",
                    {
                      include: ["src/**/*.js"],
                      exclude: [
                        "src/**/*.test.js",
                        "src/index.js",
                        "src/setupTests.js",
                        "src/data/**",
                      ],
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    },
    reporters: ["progress", "coverage", "junit"],
    coverageReporter: {
      dir: "coverage/karma",
      check: {
        global: { statements: 90, branches: 90, functions: 90, lines: 90 },
      },
      subdir: ".",
      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "json-summary" },
        { type: "lcovonly" },
      ],
    },
    junitReporter: {
      outputDir: "test-results",
      outputFile: "jasmine.xml",
      useBrowserName: false,
    },
    client: { jasmine: { random: true, seed: "20261009" } },
    browsers: ["ChromeHeadless"],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-dev-shm-usage"],
      },
    },
    singleRun: true,
    concurrency: 1,
  });
};
