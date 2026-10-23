const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { credentials } = require('../../shared/data');

Given('que criei um usuário exclusivo pela API', async function () {
  this.credentials = credentials();
  const user = await this.api.createUser(this.credentials);
  this.userId = user.userID;
  assert.equal(typeof this.userId, 'string');
  assert.ok(this.userId.length > 0);
  assert.equal(user.username, this.credentials.userName);
  assert.deepEqual(user.books, []);
});

When('gero um token de acesso', async function () {
  const response = await this.api.generateToken(this.credentials);
  this.token = response.token;
  assert.equal(response.status, 'Success');
  assert.equal(typeof this.token, 'string');
  assert.ok(this.token.length > 0);
  assert.ok(Date.parse(response.expires) > Date.now());
});

Then('a API confirma que o usuário está autorizado', async function () {
  assert.equal(await this.api.authorized(this.credentials), true);
});

When('consulto os livros disponíveis', async function () {
  const response = await this.api.books();
  assert.ok(Array.isArray(response.books));
  this.isbns = [...new Set(response.books.map(book => book.isbn))].slice(0, 2);
  assert.equal(this.isbns.length, 2, 'O catálogo deve conter pelo menos dois ISBNs diferentes');
  for (const isbn of this.isbns) assert.equal(typeof isbn, 'string');
});

When('reservo dois livros diferentes do catálogo', async function () {
  const response = await this.api.reserve(this.userId, this.isbns, this.token);
  assert.deepEqual(response.books.map(book => book.isbn).sort(), [...this.isbns].sort());
});

Then('os detalhes do usuário contêm exatamente os livros reservados', async function () {
  const user = await this.api.user(this.userId, this.token);
  assert.equal(user.userId, this.userId);
  assert.equal(user.username, this.credentials.userName);
  assert.deepEqual(user.books.map(book => book.isbn).sort(), [...this.isbns].sort());
  await this.attach(JSON.stringify({ userId: user.userId, username: user.username, books: user.books }, null, 2), 'application/json');
});
