const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { person } = require('../../shared/data');
const PracticeFormPage = require('../pages/practice-form-page');
const WindowsPage = require('../pages/windows-page');
const WebTablesPage = require('../pages/web-tables-page');
const ProgressPage = require('../pages/progress-page');
const SortablePage = require('../pages/sortable-page');

Given('que acesso {string} e o submenu {string}', async function (category, submenu) {
  await this.navigation.navigate(category, submenu);
});

When('preencho todos os campos com dados aleatórios e envio o formulário', async function () {
  this.form = new PracticeFormPage(this.driver);
  this.person = person();
  await this.form.complete(this.person);
});

Then('o popup apresenta os dados enviados', async function () {
  const actual = await this.form.submitted();
  const data = this.person;
  const month = new Date(Date.UTC(Number(data.birthYear), Number(data.birthMonth), 1))
    .toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const expected = {
    'Student Name': `${data.firstName} ${data.lastName}`,
    'Student Email': data.email,
    Gender: data.gender,
    Mobile: data.mobile,
    'Date of Birth': `${data.birthDay} ${month},${data.birthYear}`,
    Subjects: data.subject,
    Hobbies: data.hobby,
    Picture: 'upload.txt',
    Address: data.address,
    'State and City': `${data.state} ${data.city}`
  };
  for (const [field, value] of Object.entries(expected)) assert.equal(actual[field], value, `Campo ${field}`);
});

Then('consigo fechar o popup com Escape', async function () { await this.form.close(); });

When('abro uma nova janela', async function () {
  this.windows = new WindowsPage(this.driver);
  await this.windows.open();
});
Then('a nova janela apresenta a mensagem {string}', async function (message) {
  assert.equal(await this.windows.message(), message);
});
Then('fecho a nova janela e retorno à original', async function () {
  await this.windows.close();
  assert.equal(await this.driver.getWindowHandle(), this.windows.original);
});

When('crio um registro na tabela', async function () {
  this.tables = new WebTablesPage(this.driver);
  this.record = person();
  await this.tables.add(this.record);
  assert.equal(await this.tables.exists(this.record.email), true);
});
When('edito os dados desse registro', async function () {
  this.updated = person();
  await this.tables.edit(this.record.email, this.updated);
});
Then('a tabela apresenta os dados atualizados', async function () {
  const data = this.updated;
  assert.deepEqual(await this.tables.cells(data.email),
    [data.firstName, data.lastName, data.age, data.email, data.salary, data.department]);
  assert.equal(await this.tables.exists(this.record.email), false);
});
When('excluo esse registro', async function () { await this.tables.remove(this.updated.email); });
Then('esse registro não aparece mais na tabela', async function () {
  assert.equal(await this.tables.exists(this.updated.email), false);
});

When('crio {int} registros exclusivos dinamicamente', async function (count) {
  this.tables = new WebTablesPage(this.driver);
  for (let index = 0; index < count; index++) {
    const data = person();
    await this.tables.add(data);
    this.createdRows.push(data);
  }
});
Then('todos os {int} registros estão presentes', async function (count) {
  assert.equal(this.createdRows.length, count);
  assert.equal(new Set(this.createdRows.map(row => row.email)).size, count);
  // A busca permite validar registros de todas as páginas da tabela.
  for (const row of this.createdRows) assert.equal(await this.tables.exists(row.email), true, row.email);
});
When('excluo todos os registros que criei', async function () {
  let clicks = 0;
  for (const row of this.createdRows) {
    // A versão atual do site pode remover vários registros no primeiro clique.
    // Conferir existência evita tentar excluir uma linha que já desapareceu.
    if (await this.tables.exists(row.email)) {
      await this.tables.remove(row.email);
      clicks++;
    }
  }
  await this.attach(JSON.stringify({ registrosCriados: this.createdRows.length, cliquesDeExclusao: clicks,
    registrosJaAusentes: this.createdRows.length - clicks }, null, 2), 'application/json');
});
Then('nenhum dos registros criados permanece na tabela', async function () {
  for (const row of this.createdRows) assert.equal(await this.tables.exists(row.email), false, row.email);
});

When('inicio e paro a barra antes de vinte e cinco por cento', async function () {
  this.progress = new ProgressPage(this.driver);
  await this.progress.stopEarly();
});
Then('a barra está parada com valor menor ou igual a vinte e cinco', async function () {
  const value = await this.progress.value();
  assert.ok(value > 0 && value <= 25, `Progresso obtido: ${value}%`);
  assert.equal(await this.progress.label(), 'Start');
});
When('reinicio a barra e aguardo cem por cento', async function () { await this.progress.finish(); });
When('reseto a barra de progresso', async function () { await this.progress.reset(); });
Then('a barra volta a zero', async function () { assert.equal(await this.progress.value(), 0); });

When('ordeno os elementos com drag and drop', async function () {
  this.sortable = new SortablePage(this.driver);
  await this.sortable.sort();
});
Then('os elementos aparecem em ordem crescente', async function () {
  assert.deepEqual(await this.sortable.texts(), this.sortable.order);
});
