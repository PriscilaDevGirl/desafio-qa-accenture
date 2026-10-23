# Desafio Frontend 2

Automação da interface do DemoQA com Selenium WebDriver, Cucumber e Page Objects.

| Cenário | Validação |
| --- | --- |
| Practice Form | Todos os campos, upload de `.txt`, dados apresentados no popup e fechamento com Escape |
| Browser Windows | Nova janela, mensagem e retorno à janela original |
| Web Tables | Inclusão, edição e exclusão de registro |
| Bônus | Inclusão dinâmica e exclusão de 12 registros exclusivos |
| Progress Bar | Pausa até 25%, conclusão em 100% e reset estável em zero |
| Sortable | Ordenação crescente por drag and drop |

## Executar

Na raiz do projeto:

```powershell
$env:HEADLESS = 'false'
npm.cmd run test:frontend
```

`npm.cmd run test:ui` executa os mesmos cenários. Para executar apenas o bônus, use `npm.cmd run test:bonus`.

O relatório é gerado em `reports/desafio-frontend-2.html`, na raiz do projeto.

## Organização

- `features/interface.feature`: cenários BDD.
- `steps/ui.steps.js`: passos e asserções.
- `pages/`: Page Objects e interações.
- `fixtures/upload.txt`: arquivo utilizado no formulário.

O estado e a cidade do formulário são sorteados entre combinações válidas. Cada cenário abre uma sessão própria do navegador. Os comportamentos específicos do DemoQA estão descritos em [defeitos conhecidos](../docs/defeitos.md).

## Evidências

Execute `npm.cmd run evidencias` na raiz. Esse comando captura a página após cada etapa, anexa as imagens ao relatório Cucumber e grava os resultados e screenshots em uma pasta própria da execução. O cenário de bônus também registra os 12 dados gerados.

Veja o [índice de evidências](../evidencias/README.md).
