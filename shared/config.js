module.exports = {
  baseUrl: process.env.BASE_URL || 'https://demoqa.com',
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS !== 'false',
  timeout: Number(process.env.WAIT_TIMEOUT || 15000)
};
