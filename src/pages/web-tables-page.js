const { By, until } = require('selenium-webdriver');
const BasePage = require('./base-page');
const { timeout } = require('../config');

class WebTablesPage extends BasePage {
  async save(data) {
    for (const key of ['firstName', 'lastName', 'email', 'age', 'salary', 'department']) {
      await this.fill(By.id(key === 'email' ? 'userEmail' : key), data[key]);
    }
    const form = await this.element(By.id('registration-form-modal'));
    await this.click(By.id('submit'));
    await this.driver.wait(until.stalenessOf(form), timeout);
  }
  async search(email) { await this.fill(By.id('searchBox'), email); }
  async row(email) {
    await this.search(email);
    return this.element(By.xpath(`//div[contains(@class,'web-tables-wrapper')]//tbody/tr[td[normalize-space(.)='${email}']]`));
  }
  async add(data) {
    await this.search('');
    await this.click(By.id('addNewRecordButton'));
    await this.save(data);
  }
  async edit(previousEmail, data) {
    const row = await this.row(previousEmail);
    await this.clickElement(await row.findElement(By.css('[title="Edit"]')));
    await this.save(data);
  }
  async cells(email) {
    const row = await this.row(email);
    return Promise.all((await row.findElements(By.css('td'))).slice(0, 6).map(cell => cell.getText()));
  }
  async remove(email) {
    const row = await this.row(email);
    await this.clickElement(await row.findElement(By.css('[title="Delete"]')));
    await this.driver.wait(async () => !(await this.exists(email)), timeout);
  }
  async exists(email) {
    await this.search(email);
    const cells = await this.driver.findElements(By.css('.web-tables-wrapper tbody td'));
    const texts = await Promise.all(cells.map(cell => cell.getText()));
    return texts.includes(email);
  }
}

module.exports = WebTablesPage;
