const { By } = require('selenium-webdriver');
const BasePage = require('./base-page');
const { timeout } = require('../config');

class ProgressPage extends BasePage {
  async value() {
    return Number(await (await this.element(By.css('[role="progressbar"]'))).getAttribute('aria-valuenow'));
  }
  async stopEarly() {
    await this.click(By.id('startStopButton'));
    // Margem de 15 pontos para a latência do WebDriver. Nunca alterar o estado pelo DOM.
    await this.driver.wait(async () => (await this.value()) >= 10, timeout, 'A barra não iniciou', 50);
    await this.click(By.id('startStopButton'));
  }
  async label() { return (await this.element(By.id('startStopButton'))).getText(); }
  async finish() {
    await this.click(By.id('startStopButton'));
    await this.driver.wait(async () => (await this.value()) === 100, 30000, 'A barra não chegou a 100%', 100);
    await this.element(By.id('resetButton'));
  }
  async reset() { await this.click(By.id('resetButton')); }
}

module.exports = ProgressPage;
