const { By } = require('selenium-webdriver');
const assert = require('node:assert/strict');
const BasePage = require('./base-page');
const { timeout } = require('../../shared/config');

class SortablePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.order = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
    this.locator = By.css('#demo-tabpane-list .list-group-item');
  }
  async texts() {
    return Promise.all((await this.driver.findElements(this.locator)).map(item => item.getText()));
  }
  async drag(from, to) {
    const items = await this.driver.findElements(this.locator);
    await this.driver.executeScript('arguments[0].scrollIntoView({block: "center"})', items[from]);
    const before = await this.texts();
    const bounds = await this.driver.executeScript(`return Array.from(arguments).map(e => {
      const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    })`, items[from], items[to]);
    const start = bounds[0];
    const end = { x: bounds[1].x, y: bounds[1].y + (from < to ? 14 : -14) };
    // Múltiplos movimentos reais permitem ao HTML5 emitir dragstart e dragover.
    const actions = this.driver.actions({ async: true }).move({ x: Math.round(start.x), y: Math.round(start.y) }).press();
    const steps = 12;
    for (let step = 1; step <= steps; step++) {
      actions.move({ x: Math.round(start.x + (end.x - start.x) * step / steps),
        y: Math.round(start.y + (end.y - start.y) * step / steps), duration: 80 }).pause(50);
    }
    await actions.release().perform();
    await this.driver.wait(async () => JSON.stringify(await this.texts()) !== JSON.stringify(before), timeout,
      'O gesto de drag and drop não alterou a ordem');
  }
  async sort() {
    await this.click(By.id('demo-tab-list'));
    // A página costuma começar ordenada. Desordenar por gesto garante que o teste
    // realmente exercita o drag and drop, em vez de passar sem mover elementos.
    const initial = await this.texts();
    await this.drag(0, 2);
    assert.notDeepEqual(await this.texts(), initial, 'O gesto deve mover um elemento');
    for (let target = 0; target < this.order.length; target++) {
      const current = await this.texts();
      const source = current.indexOf(this.order[target]);
      assert.ok(source >= 0, `Elemento ausente: ${this.order[target]}`);
      if (source !== target) await this.drag(source, target);
    }
  }
}

module.exports = SortablePage;
