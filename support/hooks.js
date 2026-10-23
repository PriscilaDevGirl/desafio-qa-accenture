const { Before, After, AfterStep, Status } = require('@cucumber/cucumber');
const fs = require('node:fs');
const path = require('node:path');
const { slug, saveJson } = require('./evidence');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');
const { browser, headless, timeout } = require('../shared/config');
const BasePage = require('../desafio-frontend-2/pages/base-page');

Before({ tags: '@ui' }, async function ({ pickle }) {
  this.evidenceSteps = [];
  this.scenarioName = pickle.name;
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
  // A janela visível pode ser limitada pelo monitor. Fixar o viewport mantém
  // o mesmo layout desktop nos modos visível e headless.
  await this.driver.sendDevToolsCommand('Emulation.setDeviceMetricsOverride', {
    width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false
  });
  // Publicidade e rastreamento não fazem parte dos fluxos do desafio.
  await this.driver.sendDevToolsCommand('Network.enable', {});
  await this.driver.sendDevToolsCommand('Network.setBlockedURLs', {
    urls: [
      '*://*.googletagservices.com/*', '*://*.googlesyndication.com/*',
      '*://*.doubleclick.net/*', '*://*.googletagmanager.com/*',
      '*://*.google-analytics.com/*'
    ]
  });
  this.navigation = new BasePage(this.driver);
});

AfterStep({ tags: '@ui' }, async function ({ pickleStep, result }) {
  if (!process.env.EVIDENCE_DIR || !this.driver || result.status === Status.SKIPPED) return;
  const directory = path.join(process.env.EVIDENCE_DIR, 'desafio-frontend-2', slug(this.scenarioName));
  fs.mkdirSync(directory, { recursive: true });
  const number = String(this.evidenceSteps.length + 1).padStart(2, '0');
  const filename = `${number}-${slug(pickleStep.text)}.png`;
  const screenshot = Buffer.from(await this.driver.takeScreenshot(), 'base64');
  fs.writeFileSync(path.join(directory, filename), screenshot);
  this.evidenceSteps.push({ step: pickleStep.text, status: result.status.toLowerCase(), screenshot: filename });
  await this.attach(screenshot, 'image/png');
});

After(async function ({ result, pickle }) {
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
      try {
        if (process.env.EVIDENCE_DIR) {
          if (this.driver) {
            saveJson(path.join(process.env.EVIDENCE_DIR, 'desafio-frontend-2', slug(pickle.name), 'resultado.json'), {
              scenario: pickle.name, status: result.status.toLowerCase(), steps: this.evidenceSteps,
              ...(this.createdRows.length ? { createdRecords: this.createdRows } : {})
            });
          } else if (this.userId) {
            saveJson(path.join(process.env.EVIDENCE_DIR, 'desafio-api-1', 'requisicoes.json'), this.api.exchanges);
          }
        }
      } finally {
        if (this.driver) await this.driver.quit();
      }
    }
  }
});
