
const realBrowser = String(process.env.BROWSER).match(/^(1|true)$/gi)
const travisLaunchers = {
  chrome_travis: {
    base: 'Chrome',
    flags: [ '--no-sandbox' ]
  }
}

const localBrowsers = realBrowser ? Object.keys(travisLaunchers) : [ 'Chrome' ]
// const localBrowsers = [ 'Chrome' ];

module.exports = (config) => {
  config.set({
    base : '',
    frameworks: [ 'jasmine', 'karma-typescript' ],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-typescript',
      'karma-spec-reporter'
    ],
    karmaTypescriptConfig: {
      compilerOptions: {
        module: "commonjs",
        sourceMap: true,
      },
      tsconfig: "./tsconfig.json",
    },
    client: {
      // leave Jasmine Spec Runner output visible in browser
      clearContext: false
    },
    files: [
        { pattern: 'src/**/*.ts', included: true },
        { pattern: 'tests/**/*.spec.ts', included: true },
    ],
    preprocessors: {
      'src/**/*.ts': [ 'karma-typescript' ],
      'tests/**/*.spec.ts': [ 'karma-typescript' ],
    },
    reporters: [ 'spec', 'karma-typescript' ],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: localBrowsers,
    singleRun: true
  })
}
