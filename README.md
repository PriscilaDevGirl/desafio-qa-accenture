# Desafio QA Automation — Accenture

Testes de API e interface do [DemoQA](https://demoqa.com/) em JavaScript, com Selenium WebDriver, Cucumber e Page Objects. A coleção Postman executa o mesmo fluxo de API.

## Execução rápida

Requisitos: Node.js 22 ou superior, npm, Google Chrome e acesso à internet.

```powershell
npm.cmd ci
npm.cmd test
```

No Windows, use `npm.cmd` para evitar bloqueios do `npm.ps1` pela política do PowerShell. Em Linux/macOS, use `npm`.

O navegador executa em modo headless. Para acompanhar a interface:

```powershell
$env:HEADLESS = 'false'
npm.cmd run test:ui
```

O passo a passo de instalação, configuração e execução está no [guia de execução](GUIA_EXECUCAO.md).

A área da página é fixada em 1920×1080, inclusive com o navegador visível, para manter o layout desktop em monitores menores. Os cliques aguardam o elemento estar disponível e sem sobreposição.

As sessões de teste bloqueiam os serviços de publicidade e rastreamento do Google carregados pelo site. Os fluxos e as chamadas de API do DemoQA continuam usando o ambiente real.

## Comandos

| Comando | Escopo |
| --- | --- |
| `npm.cmd test` | Suíte completa |
| `npm.cmd run test:api` | Fluxo de API |
| `npm.cmd run test:ui` | Interface, incluindo o bônus |
| `npm.cmd run test:bonus` | Inclusão e exclusão de 12 registros |
| `npm.cmd run test:dry` | Conferência dos passos BDD, sem acessar o site |
| `npm.cmd run check` | Validação da sintaxe JavaScript |

## Cobertura

| Fluxo | Verificações |
| --- | --- |
| API | Criar usuário, gerar token, autorizar, listar o catálogo, reservar dois livros e consultar o usuário com os livros escolhidos |
| Practice Form | Preencher todos os campos, enviar o arquivo `.txt`, validar os dados no popup e fechar com Escape |
| Browser Windows | Abrir uma janela, validar a mensagem e retornar à janela original |
| Web Tables | Criar, editar e excluir um registro |
| Bônus | Criar 12 registros exclusivos, conferir a inclusão e verificar a exclusão de todos |
| Progress Bar | Parar até 25%, retomar até 100% e resetar para zero |
| Sortable | Ordenar a lista por drag and drop |

## Estrutura

```text
.github/workflows/   Execução no GitHub Actions
docs/               Enunciado, validação e defeitos conhecidos
features/           Cenários BDD, steps e hooks
fixtures/           Arquivo de upload
postman/            Coleção e instruções do Postman
scripts/            Verificação de sintaxe
src/api/            Cliente HTTP
src/pages/          Page Objects
reports/            Relatórios gerados durante a execução
```

Os cenários usam dados sintéticos exclusivos. Cada cenário de interface abre seu próprio navegador. O fluxo de API exclui o usuário de teste ao terminar. O arquivo de upload acompanha o projeto em `fixtures/upload.txt`.

## Postman

Importe a [coleção](postman/Desafio-QA-Accenture.postman_collection.json) e execute as sete requisições em ordem pelo Runner. Usuário, token e ISBNs são preenchidos automaticamente. A última requisição exclui o usuário criado. Consulte as [instruções do Postman](postman/README.md).

## Resultados e observações

Validação registrada: **7 cenários e 34 passos aprovados** na suíte Cucumber e **7 requisições e 27 asserções aprovadas** na coleção Postman com Newman. Veja os [resultados](docs/validacao.md).

O relatório Cucumber é gerado em `reports/cucumber.html`. Falhas de interface incluem screenshot e logs do console. Relatórios, dependências e caches ficam fora do Git.

O DemoQA apresenta comportamentos documentados no fechamento do formulário, na exclusão de registros e no reset da barra de progresso. O teste usa Escape no formulário, verifica os registros antes de excluir e aguarda a conclusão estável da barra antes do reset. Os passos de reprodução e as evidências estão em [defeitos conhecidos](docs/defeitos.md).

## Referências

- [Enunciado](docs/enunciado.pptx)
- [Swagger do DemoQA](https://demoqa.com/swagger/)
- [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/)
- [Cucumber.js](https://github.com/cucumber/cucumber-js)
