module.exports = {
  envVariables: {
    NODE_ENV: '"production"',
    BUILD_ENV: '"production"'
  },
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build:prod --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report
};
