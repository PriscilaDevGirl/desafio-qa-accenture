# Resultado da validação

Execução em 22/10/2026 contra `https://demoqa.com`, em Windows com Node.js 24.14.1, Chrome 155, Selenium WebDriver 4.51.0 e Cucumber 12.9.0.

## Verificações

- `npm.cmd run check`: sintaxe JavaScript válida.
- `npm.cmd run test:dry`: sete cenários e 34 passos reconhecidos, sem passos indefinidos ou ambíguos. O dry run não executa os testes.
- `npm.cmd test`: execução real completa, com seis cenários aprovados e um reprovado. Foram 33 passos aprovados e um reprovado, em aproximadamente 96 segundos.

| Cenário | Resultado |
| --- | --- |
| API: criar usuário, gerar token, autorizar, reservar e consultar dois livros | Aprovado |
| Practice Form: preencher, enviar, validar e fechar | Reprovado somente no fechamento do popup, BUG-01 |
| Browser Windows: abrir, validar a mensagem e fechar | Aprovado |
| Web Tables: criar, editar e excluir | Aprovado |
| Bônus: criar 12 registros, validar todos e excluir | Aprovado com comportamento do produto registrado no BUG-02 |
| Progress Bar: pausar até 25%, concluir e resetar | Aprovado |
| Sortable: desordenar e reordenar com gestos de mouse | Aprovado |

A saída da execução completa é `1` por causa do BUG-01. A falha não foi ignorada nem convertida em sucesso. O preenchimento do formulário, o upload e os dados apresentados no popup passaram antes da falha no fechamento.

## Evidências

- [Defeitos e reprodução](BUGS.md)
- [Screenshot do popup que permanece aberto](docs/evidencias/BUG-01-popup.png)
- [Erro de console após o clique em Close](docs/evidencias/BUG-01-console.json)
- Relatório HTML completo local: `reports/cucumber.html`.
- Relatório JSON completo local: `reports/cucumber.json`.

Os relatórios completos são gerados novamente em cada execução e ficam fora do Git. O screenshot e o trecho de console do defeito acompanham o código no repositório.

O teste de bônus confirmou a presença dos 12 emails exclusivos. Um clique de exclusão fez os 12 registros desaparecerem. A automação registrou um clique e 11 registros já ausentes, verificando ao final que nenhum dos 12 permaneceu. Esse resultado evidencia o BUG-02 e não valida a correção da exclusão individual do site.

Não houve publicação em um repositório remoto nem execução do workflow no GitHub Actions. O workflow acompanha o projeto para execução depois da publicação. A execução foi validada em Chrome headless. A configuração de Edge está disponível, mas não foi executada nesta validação.
