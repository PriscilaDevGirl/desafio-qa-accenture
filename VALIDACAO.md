# Resultado da validação

Execução em 22/10/2026 contra `https://demoqa.com`, em Windows com Node.js 24.14.1, Chrome 155, Selenium WebDriver 4.51.0 e Cucumber 12.9.0.

## Verificações

- `npm.cmd run check`: sintaxe JavaScript válida.
- `npm.cmd run test:dry`: verificação inicial com sete cenários e 34 passos reconhecidos, sem passos indefinidos ou ambíguos. O dry run não executa os testes.
- `npm.cmd test`: nova execução real completa após adotar Escape no fechamento do formulário. Os sete cenários e os 34 passos passaram, em aproximadamente 80 segundos, com saída `0`.

| Cenário | Resultado |
| --- | --- |
| API: criar usuário, gerar token, autorizar, reservar e consultar dois livros | Aprovado |
| Practice Form: preencher, enviar, validar e fechar com Escape | Aprovado |
| Browser Windows: abrir, validar a mensagem e fechar | Aprovado |
| Web Tables: criar, editar e excluir | Aprovado |
| Bônus: criar 12 registros, validar todos e excluir | Aprovado com comportamento do produto registrado no BUG-02 |
| Progress Bar: pausar até 25%, concluir e resetar | Aprovado |
| Sortable: desordenar e reordenar com gestos de mouse | Aprovado |

A execução anterior identificou o BUG-01 no botão Close. Uma investigação adicional confirmou que Escape e clique no fundo fecham o popup, enquanto clique, Enter e Espaço no botão reproduzem o erro. O cenário agora usa Escape, pois o enunciado exige fechar o popup sem especificar o botão. O teste continua validando todos os campos enviados e o desaparecimento real do modal, sem alterar o DOM para forçar sucesso. O defeito do botão permanece documentado.

## Evidências

- [Defeitos e reprodução](BUGS.md)
- [Screenshot do popup que permanece aberto](docs/evidencias/BUG-01-popup.png)
- [Erro de console após o clique em Close](docs/evidencias/BUG-01-console.json)
- [Comparação entre clique, teclado, Escape e clique no fundo](docs/evidencias/popup-alternatives.json)
- Relatório HTML completo local: `reports/cucumber.html`.
- Relatório JSON completo local: `reports/cucumber.json`.

Os relatórios completos são gerados novamente em cada execução e ficam fora do Git. Eles refletem a última execução, que pode ser da suíte completa ou de um grupo selecionado por tags. O screenshot e o trecho de console preservam o defeito original do botão e acompanham o código no repositório.

O teste de bônus confirmou a presença dos 12 emails exclusivos. Um clique de exclusão fez os 12 registros desaparecerem. A automação registrou um clique e 11 registros já ausentes, verificando ao final que nenhum dos 12 permaneceu. Esse resultado evidencia o BUG-02 e não valida a correção da exclusão individual do site.

Não houve publicação em um repositório remoto nem execução do workflow no GitHub Actions. O workflow acompanha o projeto para execução depois da publicação. A execução foi validada em Chrome headless. A configuração de Edge está disponível, mas não foi executada nesta validação.

## Coleção Postman

A coleção `postman/Desafio-QA-Accenture.postman_collection.json` foi executada em 22/10/2026 usando Newman contra o serviço real: **sete requisições e 27 asserções aprovadas**, sem falhas. O fluxo terminou excluindo o usuário criado, com HTTP 204. O relatório local está em `reports/postman.json`. Uma nova execução isolada de `npm.cmd run test:api` também passou, com um cenário e seis passos aprovados. Não houve validação pela interface gráfica do Postman.
