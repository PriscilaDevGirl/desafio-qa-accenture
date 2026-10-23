const assert = require('node:assert/strict');
const { baseUrl } = require('../../shared/config');
const redact = require('../../shared/redact');

class BookstoreClient {
  constructor() { this.exchanges = []; }
  async request(method, path, { body, token, expectedStatus = 200 } = {}) {
    const started = Date.now();
    const response = await fetch(new URL(path, baseUrl), {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(30000)
    });
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch {
      throw new Error(`${method} ${path}: resposta não JSON (HTTP ${response.status}).`);
    }
    this.exchanges.push({ method, path, status: response.status, durationMs: Date.now() - started,
      ...(body ? { requestBody: redact(body) } : {}), responseBody: redact(data) });
    assert.equal(response.status, expectedStatus,
      `${method} ${path}: esperado HTTP ${expectedStatus}, recebido ${response.status}. Código: ${data?.code ?? 'n/a'}`);
    return data;
  }

  createUser(body) { return this.request('POST', '/Account/v1/User', { body, expectedStatus: 201 }); }
  generateToken(body) { return this.request('POST', '/Account/v1/GenerateToken', { body }); }
  authorized(body) { return this.request('POST', '/Account/v1/Authorized', { body }); }
  books() { return this.request('GET', '/BookStore/v1/Books'); }
  reserve(userId, isbns, token) {
    return this.request('POST', '/BookStore/v1/Books', {
      body: { userId, collectionOfIsbns: isbns.map(isbn => ({ isbn })) }, token, expectedStatus: 201
    });
  }
  user(userId, token) { return this.request('GET', `/Account/v1/User/${userId}`, { token }); }
  deleteUser(userId, token) {
    return this.request('DELETE', `/Account/v1/User/${userId}`, { token, expectedStatus: 204 });
  }
}

module.exports = BookstoreClient;
