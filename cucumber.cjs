const common = {
  paths: ['desafio-api-1/features/**/*.feature', 'desafio-frontend-2/features/**/*.feature'],
  require: ['support/**/*.js', 'desafio-api-1/steps/**/*.js', 'desafio-frontend-2/steps/**/*.js'],
  parallel: 1
};

module.exports = {
  default: { ...common, format: ['progress', 'html:reports/cucumber.html', 'json:reports/cucumber.json'] },
  api: { ...common, tags: '@api', format: ['progress', 'html:reports/desafio-api-1.html', 'json:reports/desafio-api-1.json'] },
  frontend: { ...common, tags: '@ui', format: ['progress', 'html:reports/desafio-frontend-2.html', 'json:reports/desafio-frontend-2.json'] }
};
