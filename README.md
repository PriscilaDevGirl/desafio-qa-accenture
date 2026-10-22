# Desafio QA Automation — Accenture

Solução em JavaScript com Selenium WebDriver, Cucumber (BDD em português) e Page Objects. O enunciado original está em `Desafio_QA (004) (1).pptx`.

## Pré-requisitos e execução

- Node.js 22 ou superior e npm.
- Google Chrome instalado. Alternativamente, Microsoft Edge.
- Internet para instalar dependências, obter o driver pelo Selenium Manager e acessar o DemoQA.

Na pasta do projeto:

```powershell
npm.cmd ci
npm.cmd test
```

No Windows, `npm.cmd` funciona mesmo quando a política do PowerShell bloqueia `npm.ps1`. Em Linux/macOS, use `npm`.

```powershell
npm.cmd run test:api    # Fluxo de API completo, em um único cenário
npm.cmd run test:ui     # Interface, incluindo o bônus
npm.cmd run test:bonus  # Criar, validar e excluir 12 registros
npm.cmd run test:dry    # Validar o vínculo dos passos sem acessar o site
npm.cmd run check       # Validar a sintaxe JavaScript
```

A execução padrão usa Chrome headless. Para acompanhar as interações:

```powershell
$env:HEADLESS = 'false'
npm.cmd run test:ui
```

Para usar Edge:

```powershell
$env:BROWSER = 'edge'
npm.cmd run test:ui
```

Outras configurações: `BASE_URL` (padrão `https://demoqa.com`) e `WAIT_TIMEOUT` (espera de elementos em milissegundos, padrão `15000`). Cada cenário de interface abre um navegador independente. Os cenários executam sequencialmente.

## Cobertura do enunciado

| Requisito | Implementação e validação |
| --- | --- |
| Criar usuário | Nome exclusivo, HTTP 201, identificador, nome e coleção inicial vazia |
| Gerar token | HTTP 200, status de sucesso, token não vazio e expiração futura |
| Confirmar autorização | Resposta booleana `true` |
| Listar livros | Catálogo com pelo menos dois ISBNs diferentes |
| Reservar dois livros | HTTP 201 e confirmação dos ISBNs selecionados |
| Consultar usuário e livros | Identidade e conjunto exato dos dois ISBNs, com detalhes anexados ao relatório |
| Practice Form | Todos os campos, valores aleatórios válidos, upload real de `.txt`, conteúdo do popup e fechamento |
| Browser Windows | Contagem de janelas, troca de contexto, mensagem e fechamento com retorno à janela original |
| Web Tables | Inclusão, alteração de todos os campos e exclusão com validações |
| Bônus Cucumber | Esquema de cenário com quantidade 12, dados exclusivos e validação de inclusão/exclusão de cada registro |
| Progress Bar | Pausa antecipada, valor entre 1 e 25, estado Start, conclusão em 100 e reset para zero |
| Sortable | Movimento real pelo mouse, desordenação inicial e ordenação crescente validada |

O estado e a cidade do formulário respeitam as opções dependentes do DemoQA. Os demais dados variam a cada execução. O arquivo de upload está em `fixtures/upload.txt`.

## Organização

```text
features/
  api.feature                 Fluxo de reserva em BDD
  interface.feature           Cenários de navegador e bônus
  step_definitions/           Passos e asserções dos resultados
  support/                    Contexto isolado, navegador e limpeza
src/
  api/bookstore-client.js     Cliente HTTP com validação dos status
  pages/                      Interações e seletores por página
  config.js                   Configuração por variáveis de ambiente
  data.js                     Dados sintéticos exclusivos
fixtures/upload.txt           Arquivo versionado para upload
reports/                      Relatórios gerados, ignorados pelo Git
```

Os passos expressam o comportamento e validam os resultados. Os Page Objects concentram as interações e os seletores. O cliente de API usa `fetch` nativo, sem depender de um navegador. As esperas de elementos e de progresso usam condições, sem pausas fixas para carregamento. As pequenas pausas nos gestos de mouse permitem executar o arraste.

O hook final exclui o usuário criado pela API, inclusive quando um passo falha. O teste de tabelas exclui apenas os próprios registros e mantém os registros preexistentes. Cada página de tabelas tem estado local do navegador. A busca por email permite conferir os 12 registros mesmo com paginação.

## Relatórios e diagnóstico

Depois de executar, abra `reports/cucumber.html`. O JSON fica em `reports/cucumber.json`. Falhas de interface incluem uma captura de tela no relatório. Não registrar tokens ou senhas. Os relatórios usam dados sintéticos e não entram no Git.

O DemoQA é um ambiente público externo. Falhas de rede, indisponibilidade, alterações no DOM ou anúncios que interceptam cliques podem afetar os testes. Os cenários usam o serviço real, sem substituir as respostas por mocks. Consulte `VALIDACAO.md` para os resultados obtidos neste ambiente e `BUGS.md` para os defeitos do site. O fechamento do popup apresenta um defeito confirmado: esse cenário permanece falhando e torna a execução completa e o workflow vermelhos enquanto o site não corrigir o problema.

## Entrega no GitHub

O projeto possui versionamento Git local. Para publicar, crie um repositório vazio na sua conta e, nesta pasta, execute os comandos abaixo, substituindo a URL pelo seu repositório:

```powershell
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/desafio-qa-accenture.git
git push -u origin main
```

O `.gitignore` exclui dependências, caches, relatórios e arquivos `.env`. Inclua o código, `package-lock.json`, o arquivo `.txt` e este README na entrega. Compartilhe o link do repositório com o avaliador.

## Referências

- [Swagger do DemoQA](https://demoqa.com/swagger/)
- [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/)
- [Cucumber.js](https://github.com/cucumber/cucumber-js)
