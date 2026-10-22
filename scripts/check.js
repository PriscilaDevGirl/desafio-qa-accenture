const { readdirSync } = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function check(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', '.cache', 'reports'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) check(file);
    else if (/\.(c?js)$/.test(entry.name)) execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  }
}
check(process.cwd());
console.log('Sintaxe JavaScript validada.');
