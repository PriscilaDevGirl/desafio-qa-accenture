module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['features/support/**/*.js', 'features/step_definitions/**/*.js'],
    format: ['progress', 'html:reports/cucumber.html', 'json:reports/cucumber.json'],
    parallel: 1
  }
};
