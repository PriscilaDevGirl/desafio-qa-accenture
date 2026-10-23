# Resultados da validação

Data: 22/10/2026. Ambiente: Windows, Node.js 24.14.1, Chrome 155, Selenium WebDriver 4.51.0 e Cucumber 12.9.0.

| Verificação | Resultado |
| --- | --- |
| `npm.cmd run check` | Sintaxe JavaScript válida |
| `npm.cmd run test:dry` | Cenários e passos reconhecidos, sem passos indefinidos ou ambíguos |
| `npm.cmd test` | 7 cenários e 34 passos aprovados, em aproximadamente 80 segundos |
| `npm.cmd test` com `HEADLESS=false` | 7 cenários e 34 passos aprovados, em aproximadamente 69 segundos, após sincronizar a conclusão e o reset da barra |
| Coleção Postman com Newman | 7 requisições e 27 asserções aprovadas, em aproximadamente 5 segundos |
| `npm.cmd run evidencias` após separar as partes | API 1: 1 cenário e 6 passos; Frontend 2: 6 cenários e 28 passos; Newman: 7 requisições e 27 asserções, todos aprovados |

## Cobertura da interface

| Cenário | Resultado |
| --- | --- |
| Formulário completo, upload e fechamento com Escape | Aprovado |
| Nova janela, mensagem e fechamento | Aprovado |
| Inclusão, edição e exclusão de registro | Aprovado |
| Inclusão e exclusão de 12 registros | Aprovado, com observação sobre o BUG-02 |
| Pausa, conclusão e reset da barra de progresso | Aprovado |
| Ordenação da lista com drag and drop | Aprovado |

O fluxo de API validou criação, autenticação e autorização do usuário, seleção e reserva de dois livros e consulta dos detalhes. A limpeza retornou HTTP 204.

## Observações

- O popup do formulário fecha com Escape. O botão Close apresenta o [BUG-01](defeitos.md).
- O bônus confirmou a inclusão dos 12 emails. Um clique excluiu os 12 registros, comportamento registrado no BUG-02. A ausência de todos foi verificada ao final.
- A barra aguarda 100% estáveis antes do reset e zero estável depois dele. O cenário passou em três execuções locais consecutivas e na suíte completa, com Chrome visível. O comportamento de temporização do site está registrado no BUG-03.
- A execução local foi validada com Chrome headless e com janela visível. A configuração de Edge está disponível, mas não fez parte dessa validação.
- O workflow do GitHub Actions usa Linux e Node.js 22. Seu resultado deve ser consultado na aba Actions do repositório.

## Evidências e relatórios

- [Defeitos conhecidos](defeitos.md)
- [Evidências das execuções separadas por desafio](../evidencias/README.md)
- [Screenshot do popup](evidencias/BUG-01-popup.png)
- [Erro do console](evidencias/BUG-01-console.json)
- [Alternativas de fechamento](evidencias/popup-alternatives.json)
- Relatório Cucumber: `reports/cucumber.html`.
- Relatórios por parte: `reports/desafio-api-1.html` e `reports/desafio-frontend-2.html`.
- Resumo Postman/Newman sem credenciais: dentro da pasta da execução em `evidencias/`.

Os relatórios ficam fora do Git e refletem a última execução. As evidências dos defeitos acompanham o código.

## Execução em monitores menores

A janela visível podia ter tamanho inferior ao solicitado pelo WebDriver, deixando o rodapé e a coluna lateral sobre os controles. A sessão agora fixa o viewport desktop em 1920×1080 pelo Chrome DevTools Protocol. A navegação seleciona o cartão da categoria e os cliques aguardam o elemento ficar livre de sobreposição, com rolagem imediata e clique nativo do WebDriver. Os serviços externos de publicidade e rastreamento do Google são bloqueados na sessão de teste.

A suíte completa passou localmente com `HEADLESS=false` após essas alterações. A execução mais recente foi feita por partes com o gerador de evidências: todos os sete cenários passaram e os resultados estão nos relatórios específicos de API 1 e Frontend 2.

## Aleatoriedade de estado e cidade

O formulário passou a sortear o estado entre NCR, Uttar Pradesh, Haryana e Rajasthan e a cidade entre as opções correspondentes. Uma validação local com Chrome visível preencheu e enviou o formulário com uma combinação sorteada de cada estado, conferiu o estado e a cidade apresentados no popup e fechou o modal com Escape. Os quatro estados foram aprovados. As grafias das cidades seguem as opções exibidas pelo DemoQA.

## Evidências organizadas

`npm.cmd run evidencias` executa o cenário de API, os seis cenários de frontend e a coleção Postman. A execução local de 22/10/2026 gerou 28 screenshots de frontend e registros das sete chamadas da API, incluindo a limpeza do usuário. Os registros de API ocultam senhas e tokens; o relatório bruto do Newman permanece fora do Git. Cada execução ganha uma pasta própria com índice, resultados e identificação do ambiente e do código.
