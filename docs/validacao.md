# Resultados da validação

Data: 22/10/2026. Ambiente: Windows, Node.js 24.14.1, Chrome 155, Selenium WebDriver 4.51.0 e Cucumber 12.9.0.

| Verificação | Resultado |
| --- | --- |
| `npm.cmd run check` | Sintaxe JavaScript válida |
| `npm.cmd run test:dry` | Cenários e passos reconhecidos, sem passos indefinidos ou ambíguos |
| `npm.cmd test` | 7 cenários e 34 passos aprovados, em aproximadamente 80 segundos |
| `npm.cmd test` com `HEADLESS=false` | 7 cenários e 34 passos aprovados, em aproximadamente 101 segundos, após ajuste de viewport e cliques |
| Coleção Postman com Newman | 7 requisições e 27 asserções aprovadas, em aproximadamente 5 segundos |

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
- A execução local foi validada com Chrome headless e com janela visível. A configuração de Edge está disponível, mas não fez parte dessa validação.
- O workflow do GitHub Actions usa Linux e Node.js 22. Seu resultado deve ser consultado na aba Actions do repositório.

## Evidências e relatórios

- [Defeitos conhecidos](defeitos.md)
- [Screenshot do popup](evidencias/BUG-01-popup.png)
- [Erro do console](evidencias/BUG-01-console.json)
- [Alternativas de fechamento](evidencias/popup-alternatives.json)
- Relatório Cucumber: `reports/cucumber.html`.
- Relatório Postman/Newman: `reports/postman.json`, quando solicitado ao executor.

Os relatórios ficam fora do Git e refletem a última execução. As evidências dos defeitos acompanham o código.

## Execução em monitores menores

A janela visível podia ter tamanho inferior ao solicitado pelo WebDriver, deixando o rodapé e a coluna lateral sobre os controles. A sessão agora fixa o viewport desktop em 1920×1080 pelo Chrome DevTools Protocol. A navegação seleciona o cartão da categoria e os cliques aguardam o elemento ficar livre de sobreposição, com rolagem imediata e clique nativo do WebDriver. Os serviços externos de publicidade e rastreamento do Google são bloqueados na sessão de teste.

A suíte completa passou localmente com `HEADLESS=false` após essas alterações. O relatório `reports/cucumber.html` dessa execução mostra os sete cenários aprovados.
