# Desafio API 1

Automação do fluxo de reserva de livros do DemoQA, em JavaScript e Cucumber, com coleção equivalente para Postman.

## Fluxo

1. Criar um usuário exclusivo.
2. Gerar um token de acesso.
3. Confirmar que o usuário está autorizado.
4. Listar o catálogo e escolher dois ISBNs distintos.
5. Reservar os dois livros.
6. Consultar o usuário e validar os livros reservados.

O hook final exclui o usuário criado pelo teste. Na coleção Postman, essa limpeza é a requisição 07.

## Executar

Na raiz do projeto:

```powershell
npm.cmd run test:api
```

O relatório é gerado em `reports/desafio-api-1.html`, na raiz do projeto.

## Postman

Importe a [coleção](postman/Desafio-QA-Accenture.postman_collection.json), mantenha as sete requisições na ordem e execute pelo Runner. Consulte as [instruções da coleção](postman/README.md).

## Organização

- `features/api.feature`: cenário BDD.
- `steps/api.steps.js`: passos e asserções.
- `src/bookstore-client.js`: chamadas HTTP e registro das respostas.
- `postman/`: coleção e instruções de execução.

## Evidências

Execute `npm.cmd run evidencias` na raiz para gerar novas evidências das duas partes e da coleção Postman. A parte de API contém os resultados Cucumber, o resumo Newman e o registro das requisições e respostas com senhas e tokens ocultados.

Veja o [índice de evidências](../evidencias/README.md).
