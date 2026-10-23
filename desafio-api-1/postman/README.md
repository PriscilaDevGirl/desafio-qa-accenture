# Coleção Postman — Desafio QA Accenture

Importe `Desafio-QA-Accenture.postman_collection.json` no Postman. A coleção usa o formato v2.1 e contém o fluxo real de API do desafio. Não é necessário preencher credenciais, ISBNs ou criar um environment.

## Executar no Postman

1. No Postman, clique em **Import**, escolha **Files** e selecione o arquivo da coleção.
2. Abra a coleção **Desafio QA Accenture — DemoQA API** e clique em **Run**.
3. Use execução **Functional / Local**, uma iteração e mantenha as sete requisições selecionadas, na ordem original.
4. Inicie a execução e confira as validações de cada requisição.

A variável `baseUrl` já está configurada como `https://demoqa.com`. Se usar o Postman na web, selecione o Desktop Agent para enviar as requisições localmente.

| Etapa | Requisição | Validações e dados compartilhados |
| --- | --- | --- |
| 01 | POST `/Account/v1/User` | Gera nome exclusivo e senha válida. Valida HTTP 201, identidade e lista inicial vazia. Salva `qaUserId`. |
| 02 | POST `/Account/v1/GenerateToken` | Valida sucesso, token preenchido e expiração futura. Salva `qaToken`. |
| 03 | POST `/Account/v1/Authorized` | Confirma HTTP 200 e resposta booleana `true`. |
| 04 | GET `/BookStore/v1/Books` | Valida catálogo e seleciona dois ISBNs distintos. Salva `qaIsbn1` e `qaIsbn2`. |
| 05 | POST `/BookStore/v1/Books` | Usa Bearer Token e reserva exatamente os dois ISBNs. |
| 06 | GET `/Account/v1/User/{{qaUserId}}` | Confere identificador, nome e conjunto exato dos livros. A resposta contém os detalhes solicitados no desafio. |
| 07 | DELETE `/Account/v1/User/{{qaUserId}}` | Exclui o usuário de teste, valida HTTP 204 e limpa as variáveis geradas. |

Os passos usam variáveis da coleção e funcionam em sequência sem copiar valores manualmente. Também é possível usar **Send** em cada requisição, seguindo a ordem numérica. O controle de interrupção automática por `setNextRequest` se aplica às execuções pelo Runner, não ao botão Send.

## Consultar o usuário após a execução

A execução padrão exclui o usuário ao final para evitar acumular dados no ambiente público. Os detalhes retornados na etapa 06 continuam disponíveis nos resultados da execução se o Runner mantiver as respostas da sessão.

Para manter o usuário temporariamente, desmarque somente a etapa **07** antes de iniciar. Ative **Keep variable values** para preservar os dados gerados no Runner. Depois, envie a requisição **06** para consultar e a **07** para excluir. Não compartilhe uma exportação com senhas ou tokens preenchidos.

## Falhas e nova execução

As asserções verificam respostas reais. Se uma validação falhar, o script solicita a interrupção do Runner e mantém o erro visível. As próximas requisições não devem executar com dados inválidos.

Se ocorrer falha depois da criação do usuário, a limpeza final pode não executar. Se o token já foi gerado, use a etapa 07 para excluir o usuário antes de reiniciar. Se a falha ocorrer antes de gerar o token, execute primeiro a etapa 02 e depois a 07, usando os valores da mesma execução. Para continuar manualmente após um erro no Runner, ative **Keep variable values** nas configurações da execução.

Cada envio da etapa 01 gera um usuário novo e reinicia as variáveis. Para repetir o fluxo completo, execute novamente a coleção desde a etapa 01.

## Executar pelo terminal com Newman

```powershell
npm.cmd exec --yes --package=newman -- newman run desafio-api-1/postman/Desafio-QA-Accenture.postman_collection.json
```

O Newman executa a própria coleção e suas asserções, sem depender dos testes Cucumber. O npm baixa o executor se ele ainda não estiver disponível.

## Validação realizada

Em 22/10/2026, a coleção foi executada contra o DemoQA com Newman: **sete requisições e 27 asserções aprovadas**, sem falhas, em aproximadamente cinco segundos. A exclusão final retornou HTTP 204. Os scripts de pré-requisição e testes também tiveram a sintaxe validada. O relatório completo local está em `reports/postman.json` e fica fora do Git, pois pode conter dados de autenticação da execução.

## Documentação de referência

- [Collection Runner](https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs/)
- [Variáveis nos scripts do Postman](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-variables/)
- [Swagger do DemoQA](https://demoqa.com/swagger/)
