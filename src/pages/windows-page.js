const { By } = require('selenium-webdriver');
const BasePage = require('./base-page');
const { timeout } = require('../config');

class WindowsPage extends BasePage {
  async open() {
    this.original = await this.driver.getWindowHandle();
    const before = await this.driver.getAllWindowHandles();
    await this.click(By.id('windowButton'));
    const handles = await this.driver.wait(async () => {
      const current = await this.driver.getAllWindowHandles();
      return current.length === before.length + 1 ? current : false;
    }, timeout, 'A nova janela não foi aberta');
    this.opened = handles.find(handle => !before.includes(handle));
    await this.driver.switchTo().window(this.opened);
  }
  async message() { return (await this.element(By.id('sampleHeading'))).getText(); }
  async close() {
    await this.driver.close();
    await this.driver.switchTo().window(this.original);
    await this.driver.wait(async () => !(await this.driver.getAllWindowHandles()).includes(this.opened), timeout);
  }
}

module.exports = WindowsPage;
