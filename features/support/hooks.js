const { Before, After, Status } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');
const { browser, headless, timeout } = require('../../src/config');
const BasePage = require('../../src/pages/base-page');

Before({ tags: '@ui' }, async function () {
  if (!['chrome', 'MicrosoftEdge', 'edge'].includes(browser)) {
    throw new Error('BROWSER deve ser chrome ou edge.');
  }
  const options = browser === 'chrome' ? new chrome.Options() : new edge.Options();
  options.addArguments('--window-size=1920,1200', '--disable-notifications');
  options.setLoggingPrefs({ browser: 'ALL' });
  if (headless) options.addArguments('--headless=new');
  let builder = new Builder().forBrowser(browser === 'edge' ? 'MicrosoftEdge' : browser);
  builder = browser === 'chrome' ? builder.setChromeOptions(options) : builder.setEdgeOptions(options);
  this.driver = await builder.build();
  await this.driver.manage().setTimeouts({ implicit: 0, pageLoad: 45000, script: timeout });
  this.navigation = new BasePage(this.driver);
});

After(async function ({ result }) {
  // Evidências não podem impedir o encerramento do navegador ou a limpeza da API.
  try {
    if (this.driver && result.status === Status.FAILED) {
      try { await this.attach(Buffer.from(await this.driver.takeScreenshot(), 'base64'), 'image/png'); }
      catch (error) { await this.attach(`Screenshot indisponível: ${error.message}`, 'text/plain'); }
      const logs = await this.driver.manage().logs().get('browser').catch(() => []);
      await this.attach(JSON.stringify(logs.map(entry => ({ level: entry.level.name, message: entry.message })), null, 2), 'application/json');
    }
  } finally {
    try {
      if (this.userId) {
        // Se o cenário falhou antes de gerar o token, tentar obtê-lo só para cleanup.
        if (!this.token) {
          const response = await this.api.generateToken(this.credentials);
          this.token = response.token;
        }
        if (!this.token) throw new Error('Sem token para excluir o usuário de teste.');
        await this.api.deleteUser(this.userId, this.token);
      }
    } finally {
      if (this.driver) await this.driver.quit();
    }
  }
});
