const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { slug, saveJson } = require('../support/evidence');
const { browser, headless, baseUrl } = require('../shared/config');

const root = path.resolve(__dirname, '..');
process.chdir(root);
const started = new Date();
const date = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
}).format(started);
const runId = date.replace(' ', '_').replaceAll(':', '-');
const evidenceRoot = path.join(root, 'evidencias', runId);
fs.mkdirSync(evidenceRoot, { recursive: true });
fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
const environment = { ...process.env, EVIDENCE_DIR: evidenceRoot };

function execute(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, env: environment, stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  return result.status ?? 1;
}

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
}

function sourceHash() {
  const hash = createHash('sha256');
  function visit(directory) {
    for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const relative = path.posix.join(directory, entry.name);
      if (entry.isDirectory()) visit(relative);
      else if (/\.(js|json|feature|cjs)$/.test(entry.name)) hash.update(relative).update(fs.readFileSync(path.join(root, relative)));
    }
  }
  for (const directory of ['desafio-api-1', 'desafio-frontend-2', 'shared', 'support', 'scripts']) visit(directory);
  for (const file of ['package.json', 'package-lock.json', 'cucumber.cjs']) hash.update(file).update(fs.readFileSync(file));
  return hash.digest('hex');
}

function cucumberSummary(profile, title) {
  const filename = path.join(root, 'reports', `desafio-${profile === 'api' ? 'api-1' : 'frontend-2'}.json`);
  fs.rmSync(filename, { force: true });
  const exitCode = execute([path.join(root, 'node_modules/@cucumber/cucumber/bin/cucumber.js'), '--profile', profile]);
  const features = readJson(filename, []);
  const scenarios = features.flatMap(feature => feature.elements || []).filter(item => item.type === 'scenario').map(item => {
    const steps = item.steps.filter(step => !step.hidden).map(step => ({
      step: `${step.keyword}${step.name}`, status: step.result?.status || 'undefined',
      durationMs: Math.round((step.result?.duration || 0) / 1000000)
    }));
    return { name: item.name, status: item.steps.every(step => step.result?.status === 'passed') ? 'passed' : 'failed', steps };
  });
  const summary = {
    title, status: exitCode === 0 && scenarios.length > 0 && scenarios.every(item => item.status === 'passed') ? 'passed' : 'failed',
    exitCode, scenarios, totalScenarios: scenarios.length, passedScenarios: scenarios.filter(item => item.status === 'passed').length,
    totalSteps: scenarios.reduce((count, item) => count + item.steps.length, 0),
    passedSteps: scenarios.reduce((count, item) => count + item.steps.filter(step => step.status === 'passed').length, 0)
  };
  return summary;
}

const api = cucumberSummary('api', 'Desafio API 1');
const frontend = cucumberSummary('frontend', 'Desafio Frontend 2');
const newmanFile = path.join(root, 'reports', 'newman-interno.json');
fs.rmSync(newmanFile, { force: true });
let newmanExit = 1;
if (process.env.npm_execpath) {
  newmanExit = execute([process.env.npm_execpath, 'exec', '--cache', path.join(root, '.cache/npm'), '--yes', '--package=newman', '--',
    'newman', 'run', 'desafio-api-1/postman/Desafio-QA-Accenture.postman_collection.json', '--timeout-request', '30000',
    '--reporters', 'cli,json', '--reporter-json-export', newmanFile]);
} else console.error('Execute este gerador com npm run evidencias.');
const rawNewman = readJson(newmanFile, {});
const executions = rawNewman.run?.executions || [];
const postman = {
  title: 'Coleção Postman — Desafio API 1', status: newmanExit === 0 && executions.length > 0 ? 'passed' : 'failed', exitCode: newmanExit,
  requests: executions.map(item => ({ name: item.item.name, method: item.request.method, status: item.response?.code,
    durationMs: item.response?.responseTime, assertions: (item.assertions || []).map(assertion => ({
      name: assertion.assertion, status: assertion.error ? 'failed' : 'passed'
    })) })),
  totalRequests: executions.length, assertions: rawNewman.run?.stats?.assertions || { total: 0, failed: 0 }
};

const metadata = {
  executedAt: date, timezone: 'America/Sao_Paulo', environment: { baseUrl, browser, headless, node: process.version, platform: process.platform },
  sourceSha256: sourceHash(), status: [api, frontend, postman].every(item => item.status === 'passed') ? 'passed' : 'failed'
};
saveJson(path.join(evidenceRoot, 'execucao.json'), metadata);
saveJson(path.join(evidenceRoot, 'desafio-api-1', 'resultado-cucumber.json'), api);
saveJson(path.join(evidenceRoot, 'desafio-api-1', 'resultado-postman.json'), postman);
saveJson(path.join(evidenceRoot, 'desafio-frontend-2', 'resultado-cucumber.json'), frontend);

const apiLines = [
  '# Desafio API 1 — Evidências', '', `Execução: ${date} (America/Sao_Paulo).`, '',
  `Cucumber: **${api.passedScenarios}/${api.totalScenarios} cenários e ${api.passedSteps}/${api.totalSteps} passos aprovados**.`, '',
  `Postman/Newman: **${postman.totalRequests} requisições e ${postman.assertions.total - postman.assertions.failed}/${postman.assertions.total} asserções aprovadas**.`, '',
  '- [Resultado Cucumber](resultado-cucumber.json)', '- [Resultado Postman/Newman](resultado-postman.json)',
  '- [Requisições e respostas da API, com credenciais ocultadas](requisicoes.json)', '',
  '| Etapa | Resultado |', '| --- | --- |',
  ...api.scenarios.flatMap(item => item.steps.map(step => `| ${step.step} | ${step.status} |`)), '',
  'O registro das requisições inclui a exclusão do usuário de teste. O relatório bruto do Newman fica apenas em `reports/newman-interno.json`, fora do Git.'
];
fs.writeFileSync(path.join(evidenceRoot, 'desafio-api-1', 'README.md'), apiLines.join('\n') + '\n');

const frontendLines = ['# Desafio Frontend 2 — Evidências', '', `Execução: ${date} (America/Sao_Paulo).`, '',
  `**${frontend.passedScenarios}/${frontend.totalScenarios} cenários e ${frontend.passedSteps}/${frontend.totalSteps} passos aprovados**.`, '',
  '[Resultado completo em JSON](resultado-cucumber.json)', ''];
for (const scenario of frontend.scenarios) {
  const directory = slug(scenario.name);
  const detailsFile = path.join(evidenceRoot, 'desafio-frontend-2', directory, 'resultado.json');
  const details = readJson(detailsFile, { steps: [] });
  frontendLines.push(`## ${scenario.name}`, '', `Resultado: **${scenario.status}**.`, '');
  for (const step of details.steps) frontendLines.push(`- [${step.step}](${directory}/${step.screenshot}) — ${step.status}`);
  if (fs.existsSync(detailsFile)) frontendLines.push(`- [Detalhes do cenário](${directory}/resultado.json)`);
  frontendLines.push('');
}
fs.writeFileSync(path.join(evidenceRoot, 'desafio-frontend-2', 'README.md'), frontendLines.join('\n').trimEnd() + '\n');

const summary = ['# Evidências dos testes', '', `Execução: **${date} (America/Sao_Paulo)**.`, '', `Resultado geral: **${metadata.status}**.`, '',
  '| Parte | Resultado |', '| --- | --- |',
  `| [Desafio API 1](desafio-api-1/README.md) | ${api.passedScenarios}/${api.totalScenarios} cenários e ${api.passedSteps}/${api.totalSteps} passos |`,
  `| [Desafio Frontend 2](desafio-frontend-2/README.md) | ${frontend.passedScenarios}/${frontend.totalScenarios} cenários e ${frontend.passedSteps}/${frontend.totalSteps} passos |`,
  `| Postman/Newman | ${postman.totalRequests} requisições, ${postman.assertions.total - postman.assertions.failed}/${postman.assertions.total} asserções |`, '',
  'As capturas foram feitas pelo Selenium após as etapas reais do frontend. Os resultados de API foram registrados durante as requisições; senhas e tokens foram ocultados.', '',
  '[Ambiente e identificação do código executado](execucao.json)', '',
  'Relatórios HTML locais: `reports/desafio-api-1.html` e `reports/desafio-frontend-2.html`.'];
fs.writeFileSync(path.join(evidenceRoot, 'README.md'), summary.join('\n') + '\n');
fs.writeFileSync(path.join(root, 'evidencias', 'README.md'), `# Evidências\n\n[Última execução: ${date}](${runId}/README.md)\n\nPara gerar novas evidências, execute \`npm.cmd run evidencias\`. Cada execução cria uma pasta própria, com API e frontend separados.\n`);
console.log(`Evidências geradas em: ${evidenceRoot}`);
process.exitCode = metadata.status === 'passed' ? 0 : 1;
