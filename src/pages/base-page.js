const { By, until } = require('selenium-webdriver');
const { baseUrl, timeout } = require('../config');

class BasePage {
  constructor(driver) { this.driver = driver; }
  async element(locator) {
    const element = await this.driver.wait(until.elementLocated(locator), timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }
  async click(locator) {
    const element = await this.element(locator);
    await this.driver.executeScript('arguments[0].scrollIntoView({block: "center"})', element);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    await element.click();
  }
  async fill(locator, value) {
    const element = await this.element(locator);
    await element.clear();
    await element.sendKeys(value);
  }
  async navigate(category, submenu) {
    await this.driver.get(baseUrl);
    await this.click(By.xpath(`//div[contains(@class,'card')]//h5[normalize-space(.)='${category}']`));
    await this.click(By.xpath(`//span[normalize-space(.)='${submenu}']`));
    await this.element(By.css('h1'));
  }
}

module.exports = BasePage;
