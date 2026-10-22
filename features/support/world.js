const { setWorldConstructor, setDefaultTimeout, World } = require('@cucumber/cucumber');
const BookstoreClient = require('../../src/api/bookstore-client');

class TestWorld extends World {
  constructor(options) {
    super(options);
    this.api = new BookstoreClient();
    this.createdRows = [];
  }
}

setWorldConstructor(TestWorld);
setDefaultTimeout(90000);
