# Resultados da validação

Data: 22/10/2026. Ambiente: Windows, Node.js 24.14.1, Chrome 155 headless, Selenium WebDriver 4.51.0 e Cucumber 12.9.0.

| Verificação | Resultado |
| --- | --- |
| `npm.cmd run check` | Sintaxe JavaScript válida |
| `npm.cmd run test:dry` | Cenários e passos reconhecidos, sem passos indefinidos ou ambíguos |
| `npm.cmd test` | 7 cenários e 34 passos aprovados, em aproximadamente 80 segundos |
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
- A configuração de Edge está disponível, mas não fez parte dessa validação.
- O workflow do GitHub Actions usa Linux e Node.js 22. Seu resultado deve ser consultado na aba Actions do repositório.

## Evidências e relatórios

- [Defeitos conhecidos](defeitos.md)
- [Screenshot do popup](evidencias/BUG-01-popup.png)
- [Erro do console](evidencias/BUG-01-console.json)
- [Alternativas de fechamento](evidencias/popup-alternatives.json)
- Relatório Cucumber: `reports/cucumber.html`.
- Relatório Postman/Newman: `reports/postman.json`, quando solicitado ao executor.

Os relatórios ficam fora do Git e refletem a última execução. As evidências dos defeitos acompanham o código.
