function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
      key, /^(password|token|authorization|access_token|refresh_token)$/i.test(key) ? '[REDACTED]' : redact(item)
    ]));
  }
  return value;
}

module.exports = redact;
