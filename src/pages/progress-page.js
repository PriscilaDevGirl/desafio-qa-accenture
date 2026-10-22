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
  async waitForStableValue(expected, waitTimeout = timeout) {
    let stableSince;
    await this.driver.wait(async () => {
      if ((await this.value()) !== expected) {
        stableSince = undefined;
        return false;
      }
      stableSince ??= Date.now();
      return Date.now() - stableSince >= 300;
    }, waitTimeout, `A barra não permaneceu estável em ${expected}%.`, 50);
  }
  async finish() {
    await this.click(By.id('startStopButton'));
    // O site exibe 100% um ciclo antes de encerrar o intervalo de 100 ms.
    await this.waitForStableValue(100, 30000);
    await this.element(By.id('resetButton'));
  }
  async reset() {
    await this.click(By.id('resetButton'));
    await this.waitForStableValue(0);
  }
}

module.exports = ProgressPage;
