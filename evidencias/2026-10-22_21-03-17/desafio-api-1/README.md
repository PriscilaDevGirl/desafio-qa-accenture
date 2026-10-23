# Desafio API 1 — Evidências

Execução: 2026-10-22 21:03:17 (America/Sao_Paulo).

Cucumber: **1/1 cenários e 6/6 passos aprovados**.

Postman/Newman: **7 requisições e 27/27 asserções aprovadas**.

- [Resultado Cucumber](resultado-cucumber.json)
- [Resultado Postman/Newman](resultado-postman.json)
- [Requisições e respostas da API, com credenciais ocultadas](requisicoes.json)

| Etapa | Resultado |
| --- | --- |
| Dado que criei um usuário exclusivo pela API | passed |
| Quando gero um token de acesso | passed |
| Então a API confirma que o usuário está autorizado | passed |
| Quando consulto os livros disponíveis | passed |
| E reservo dois livros diferentes do catálogo | passed |
| Então os detalhes do usuário contêm exatamente os livros reservados | passed |

O registro das requisições inclui a exclusão do usuário de teste. O relatório bruto do Newman fica apenas em `reports/newman-interno.json`, fora do Git.
