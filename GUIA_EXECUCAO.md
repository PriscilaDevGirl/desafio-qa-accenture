# Guia de execução

## 1. Preparar o ambiente

Instale Node.js 22 ou superior e Google Chrome. O npm acompanha o Node.js. É necessário acesso à internet para instalar as dependências, obter o driver do navegador e acessar o DemoQA.

Abra o PowerShell na pasta do projeto. Neste computador:

```powershell
cd C:\Desafioacc
node --version
npm.cmd --version
npm.cmd ci
```

Execute `npm.cmd ci` na primeira utilização ou depois de atualizar as dependências. O Selenium Manager obtém o driver compatível com o navegador.

## 2. Executar todos os testes

```powershell
npm.cmd test
```

A suíte executa API e interface em sequência. O Chrome fica em modo headless, sem janela visível. Na validação registrada, o resultado foi:

```text
7 scenarios (7 passed)
34 steps (34 passed)
```

Os resultados podem variar se o serviço público estiver indisponível ou tiver alterações.

## 3. Acompanhar os testes no navegador

```powershell
$env:HEADLESS = 'false'
npm.cmd run test:ui
```

Para voltar ao modo headless:

```powershell
$env:HEADLESS = 'true'
```

## 4. Executar uma parte do desafio

```powershell
npm.cmd run test:api
npm.cmd run test:ui
npm.cmd run test:bonus
```

Para executar somente o formulário:

```powershell
npm.cmd run test:ui -- --name "Enviar o formulário completo"
```

Cada execução substitui o relatório anterior pelo resultado dos cenários selecionados.

## 5. Consultar o relatório

Depois de executar os testes, abra `reports/cucumber.html` no navegador:

```powershell
Start-Process .\reports\cucumber.html
```

O arquivo `reports/cucumber.json` contém o resultado em JSON. Falhas de interface incluem screenshot e logs. Os defeitos já identificados no DemoQA estão descritos em [docs/defeitos.md](docs/defeitos.md).

## 6. Executar no Postman

1. Abra o Postman e clique em **Import**.
2. Selecione `postman/Desafio-QA-Accenture.postman_collection.json`.
3. Abra a coleção **Desafio QA Accenture — DemoQA API** e clique em **Run**.
4. Use uma iteração e mantenha as sete requisições selecionadas, na ordem.
5. Execute e confira as asserções.

Não é necessário criar um environment nem preencher usuário, senha, token ou ISBNs. A última requisição exclui o usuário de teste. Para consultar o usuário antes de excluir, siga as [instruções da coleção](postman/README.md).

Também é possível executar a coleção pelo terminal:

```powershell
npm.cmd exec --yes --package=newman -- newman run postman/Desafio-QA-Accenture.postman_collection.json
```

## 7. Configurações opcionais

| Variável | Padrão | Uso |
| --- | --- | --- |
| `HEADLESS` | `true` | Use `false` para mostrar o navegador |
| `BROWSER` | `chrome` | Use `edge` para Microsoft Edge |
| `BASE_URL` | `https://demoqa.com` | Endereço do ambiente |
| `WAIT_TIMEOUT` | `15000` | Espera por elementos, em milissegundos |

Exemplo com Edge:

```powershell
$env:BROWSER = 'edge'
npm.cmd run test:ui
```

Para retornar ao Chrome:

```powershell
$env:BROWSER = 'chrome'
```

As variáveis definidas dessa forma valem para a sessão atual do PowerShell. A validação registrada foi realizada com Chrome headless.

## 8. Problemas comuns

| Sintoma | Ação |
| --- | --- |
| PowerShell bloqueia `npm.ps1` | Use `npm.cmd` nos comandos |
| Comando `node` não encontrado | Instale o Node.js e reabra o terminal |
| Dependências ausentes | Execute `npm.cmd ci` na raiz do projeto |
| Driver não é obtido | Confira a instalação do navegador e o acesso à internet |
| Timeout ou falha do DemoQA | Confira o relatório, os logs e a disponibilidade do site |
| Relatório mostra apenas um cenário | A última execução selecionou um grupo; execute `npm.cmd test` para gerar o relatório completo |
