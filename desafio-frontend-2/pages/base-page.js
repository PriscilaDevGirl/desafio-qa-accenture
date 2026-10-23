const { By, until, error } = require('selenium-webdriver');
const { baseUrl, timeout } = require('../../shared/config');

class BasePage {
  constructor(driver) { this.driver = driver; }
  async element(locator) {
    const element = await this.driver.wait(until.elementLocated(locator), timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }
  async click(locator) {
    const element = await this.element(locator);
    await this.clickElement(element);
  }
  async clickElement(element) {
    await this.driver.wait(async () => {
      if (!(await element.isDisplayed()) || !(await element.isEnabled())) return false;
      const reachable = await this.driver.executeScript(`
        const element = arguments[0];
        element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
        const rect = element.getBoundingClientRect();
        const left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right);
        const top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
        if (right <= left || bottom <= top) return false;
        const target = document.elementFromPoint(Math.floor((left + right) / 2), Math.floor((top + bottom) / 2));
        return target === element || element.contains(target);
      `, element);
      if (!reachable) return false;
      try { await element.click(); return true; }
      catch (failure) {
        if (failure instanceof error.ElementClickInterceptedError) return false;
        throw failure;
      }
    }, timeout, 'O elemento permaneceu encoberto ou indisponível para clique.', 100);
  }
  async fill(locator, value) {
    const element = await this.element(locator);
    await element.clear();
    await element.sendKeys(value);
  }
  async navigate(category, submenu) {
    await this.driver.get(baseUrl);
    await this.click(By.xpath(`//div[contains(concat(' ', normalize-space(@class), ' '), ' card ')][.//h5[normalize-space(.)='${category}']]`));
    await this.click(By.xpath(`//span[normalize-space(.)='${submenu}']`));
    await this.element(By.css('h1'));
  }
}

module.exports = BasePage;
