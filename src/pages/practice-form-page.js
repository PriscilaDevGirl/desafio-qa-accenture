const path = require('node:path');
const { By, Key, Select } = require('selenium-webdriver');
const BasePage = require('./base-page');
const { timeout } = require('../config');

class PracticeFormPage extends BasePage {
  async complete(data) {
    await this.fill(By.id('firstName'), data.firstName);
    await this.fill(By.id('lastName'), data.lastName);
    await this.fill(By.id('userEmail'), data.email);
    await this.click(By.xpath(`//label[normalize-space(.)='${data.gender}']`));
    await this.fill(By.id('userNumber'), data.mobile);
    await this.click(By.id('dateOfBirthInput'));
    await new Select(await this.element(By.css('.react-datepicker__year-select'))).selectByValue(data.birthYear);
    await new Select(await this.element(By.css('.react-datepicker__month-select'))).selectByValue(data.birthMonth);
    await this.click(By.css(`.react-datepicker__day--0${data.birthDay}:not(.react-datepicker__day--outside-month)`));
    await (await this.element(By.id('subjectsInput'))).sendKeys(data.subject);
    await this.click(By.xpath(`//*[@id='subjectsContainer']//*[@role='option' and normalize-space(.)='${data.subject}']`));
    await this.click(By.xpath(`//label[normalize-space(.)='${data.hobby}']`));
    await (await this.driver.findElement(By.id('uploadPicture'))).sendKeys(path.resolve('fixtures/upload.txt'));
    await this.fill(By.id('currentAddress'), data.address);
    await (await this.element(By.id('react-select-3-input'))).sendKeys(data.state);
    await this.click(By.xpath(`//*[@id='state']//*[@role='option' and normalize-space(.)='${data.state}']`));
    await (await this.element(By.id('react-select-4-input'))).sendKeys(data.city);
    await this.click(By.xpath(`//*[@id='city']//*[@role='option' and normalize-space(.)='${data.city}']`));
    await this.click(By.id('submit'));
  }
  async submitted() {
    const modal = await this.element(By.css('.modal-content'));
    const rows = await modal.findElements(By.css('tbody tr'));
    const result = {};
    for (const row of rows) {
      const cells = await row.findElements(By.css('td'));
      result[await cells[0].getText()] = await cells[1].getText();
    }
    return result;
  }
  async close() {
    await this.element(By.css('.modal.show'));
    // Escape aciona o fechamento nativo do modal. O botão Close apresenta
    // um defeito no site público, documentado separadamente em BUGS.md.
    await this.driver.actions().sendKeys(Key.ESCAPE).perform();
    await this.driver.wait(async () => {
      const dialogs = await this.driver.findElements(By.css('.modal.show'));
      return dialogs.length === 0 || !(await dialogs[0].isDisplayed());
    }, timeout, 'O popup continuou aberto após pressionar Escape.');
  }
}

module.exports = PracticeFormPage;
